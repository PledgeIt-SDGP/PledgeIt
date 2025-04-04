import logging
from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile, Depends, Header, status
from typing import List, Optional
from database.database import events_collection
from models.models import Event
from models.update_models import EventUpdate
from services.geocoding import get_coordinates
import datetime
import os
import uuid as uuid_lib  
import cloudinary
import cloudinary.uploader
from routes.auth import get_current_user
from routes.auth import organizations_collection, volunteers_collection
from bson import ObjectId
from services.email_handler import EmailService
from pydantic import EmailStr
from datetime import datetime as dt, timedelta, timezone
import re
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

client = MongoClient(os.getenv('MONGO_URI'))
db = client[os.getenv('DB_NAME')]
events_collection = db[os.getenv('EVENTS_COLLECTION')]
organizations_collection = db[os.getenv('ORGANIZATIONS_COLLECTION')]

router = APIRouter()

# Create the uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a TTL index on the "expireAt" field for automatic event cleanup
events_collection.create_index("expireAt", expireAfterSeconds=0)

def get_current_organization(x_org_email: str = Header(None)):
    if not x_org_email:
        raise HTTPException(status_code=401, detail="Missing authentication header")

    orgs_collection = db[os.getenv('ORGANIZATIONS_COLLECTION', 'organizations')]
    org = orgs_collection.find_one({"email": x_org_email})

    if not org:
        raise HTTPException(status_code=401, detail="Organization not found or not authorized")
    return org

def event_serializer(event) -> dict:
    """Serializes event data from MongoDB to API response format"""
    try:
        volunteer_requirements = str(event.get("volunteer_requirements", ""))
        expire_at = event.get("expireAt")
        if isinstance(expire_at, datetime.datetime):
            expire_at = expire_at.isoformat()
    except Exception:
        volunteer_requirements = ""
        expire_at = ""

    return {
        "event_id": event.get("event_id"),
        "event_name": event.get("event_name"),
        "organization": event.get("organization"),
        "description": event.get("description"),
        "category": event.get("category"),
        "date": event.get("date"),
        "time": event.get("time"),
        "venue": event.get("venue"),
        "city": event.get("city"),
        "address": event.get("address"),
        "latitude": event.get("latitude"),
        "longitude": event.get("longitude"),
        "duration": event.get("duration"),
        "volunteer_requirements": volunteer_requirements,
        "skills_required": event.get("skills_required", []),
        "contact_email": event.get("contact_email"),
        "contact_person": event.get("contact_person"),
        "image_url": event.get("image_url"),
        "registration_deadline": event.get("registration_deadline"),
        "additional_notes": event.get("additional_notes", ""),
        "status": event.get("status"),
        "total_registered_volunteers": event.get("total_registered_volunteers", 0),
        "created_at": event.get("created_at"),
        "expireAt": expire_at
    }

def get_next_event_id() -> int:
    """Returns the next sequential event_id using atomic operation"""
    try:
        # Initialize counter if it doesn't exist
        counter = events_collection.find_one({"_id": "event_counter"})
        if not counter:
            # Find the highest existing event_id to initialize the counter
            highest_event = events_collection.find_one(
                {"event_id": {"$exists": True}},
                sort=[("event_id", -1)]
            )
            initial_count = highest_event["event_id"] + 1 if highest_event else 1
            events_collection.insert_one({"_id": "event_counter", "count": initial_count})
            return initial_count

        result = events_collection.find_one_and_update(
            {"_id": "event_counter"},
            {"$inc": {"count": 1}},
            upsert=False,
            return_document=True
        )
        return result["count"]
    except Exception as e:
        logging.error(f"Error generating event ID: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate event ID")

# ------------------------------
# Event Endpoints
# ------------------------------

@router.get("/events/total-events", response_model=dict[str, int])
async def get_total_events():
    """Returns total count of events"""
    try:
        return {"total_events": events_collection.count_documents({})}
    except Exception as e:
        logging.error(f"Error counting events: {e}")
        raise HTTPException(status_code=500, detail="Failed to count events")

@router.get("/events", response_model=List[Event])
async def get_events():
    """Returns all events"""
    try:
        events = list(events_collection.find({"event_id": {"$type": "int"}}))
        return [Event(**event_serializer(event)) for event in events]
    except Exception as e:
        logging.error(f"Error fetching events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch events")

@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    """Returns a specific event by ID"""
    try:
        event = events_collection.find_one({
            "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
        })
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return Event(**event_serializer(event))
    except Exception as e:
        logging.error(f"Error fetching event {event_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch event")

@router.post("/events", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_name: str = Form(...),
    organization: str = Form("Demo Organization"),
    description: str = Form(...),
    category: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    venue: str = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    duration: str = Form(...),
    volunteer_requirements: Optional[str] = Form(None),
    skills_required: str = Form(...),
    contact_email: EmailStr = Form(...),
    contact_person_name: str = Form(...),
    contact_person_number: str = Form(...),
    registration_deadline: str = Form(...),
    additional_notes: Optional[str] = Form(None),
    image_url: UploadFile = File(...),
    current_org: dict = Depends(get_current_organization)
):
    """Creates a new event"""
    try:
        # Validation
        required_fields = {
            "event_name": event_name,
            "description": description,
            "category": category,
            "date": date,
            "time": time,
            "venue": venue,
            "city": city,
            "address": address,
            "duration": duration,
            "skills_required": skills_required,
            "contact_email": contact_email,
            "contact_person_name": contact_person_name,
            "contact_person_number": contact_person_number,
            "registration_deadline": registration_deadline
        }
        
        for field, value in required_fields.items():
            if not value or not str(value).strip():
                raise HTTPException(
                    status_code=400,
                    detail=f"{field.replace('_', ' ').title()} cannot be empty"
                )

        # Validate email
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", contact_email):
            raise HTTPException(status_code=400, detail="Invalid email format")

        # Validate dates
        try:
            datetime.datetime.strptime(date, "%Y-%m-%d")
            if len(time.strip()) == 5:
                datetime.datetime.strptime(time + ":00", "%H:%M:%S")
            else:
                datetime.datetime.strptime(time, "%H:%M:%S")
            datetime.datetime.strptime(registration_deadline, "%Y-%m-%d")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid date/time format: {str(e)}")

        # Validate image
        if not image_url.filename:
            raise HTTPException(status_code=400, detail="Image filename required")
        
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if image_url.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid image type")
        
        ext = os.path.splitext(image_url.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png"]:
            raise HTTPException(status_code=400, detail="Invalid image extension")

        # Process data
        event_id = get_next_event_id()
        skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]
        max_capacity = int(volunteer_requirements) if volunteer_requirements else 0

        # Get coordinates
        latitude, longitude = get_coordinates(address)
        if latitude is None or longitude is None:
            raise HTTPException(status_code=400, detail="Invalid address")

        # Upload image
        try:
            cloudinary.config(
                cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
                api_key=os.getenv("CLOUDINARY_API_KEY"),
                api_secret=os.getenv("CLOUDINARY_API_SECRET")
            )
            public_id = f"{event_id}_{os.path.splitext(image_url.filename)[0]}"
            upload_result = cloudinary.uploader.upload(
                await image_url.read(),
                public_id=public_id,
                resource_type="image"
            )
            image_url_path = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")

        # Set status and expiration
        deadline_date = dt.strptime(registration_deadline, "%Y-%m-%d").date()
        current_date = dt.now(timezone.utc).date()
        status = "Open" if deadline_date >= current_date else "Closed"
        event_datetime = dt.strptime(
            f"{date} {time if len(time.strip()) > 5 else time + ':00'}",
            "%Y-%m-%d %H:%M:%S"
        )
        expireAt = event_datetime + timedelta(days=1)

        # Prepare event data
        event_data = {
            "event_id": event_id,
            "event_name": event_name,
            "organization": current_org["name"],
            "description": description,
            "category": category,
            "date": date,
            "time": time,
            "venue": venue,
            "city": city,
            "address": address,
            "latitude": latitude,
            "longitude": longitude,
            "duration": duration,
            "volunteer_requirements": max_capacity,
            "skills_required": skills_list,
            "contact_email": contact_email,
            "contact_person": {
                "name": contact_person_name,
                "contact_number": contact_person_number
            },
            "image_url": image_url_path,
            "registration_deadline": registration_deadline,
            "additional_notes": additional_notes,
            "status": status,
            "total_registered_volunteers": 0,
            "created_at": dt.now(timezone.utc).isoformat(),
            "expireAt": expireAt,
            "registered_volunteers": []
        }

        events_collection.insert_one(event_data)

        # # Save to database in transaction
        # client = MongoClient(os.getenv('MONGO_URI'))
        # with client.start_session() as session:
        #     with session.start_transaction():
        #         events_collection.insert_one(event_data, session=session)
        #         organizations_collection.update_one(
        #             {"_id": ObjectId(current_org["_id"])},
        #             {"$push": {"created_events": str(event_id)}},
        #             session=session
        # )

        return {"message": "Event created successfully", "event_id": event_id}

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database with a numeric event_id.
    Returns events serialized according to the Event model.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    """Fetches a single event by its event_id"""
    event = events_collection.find_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if event:
        return Event(**event_serializer(event))
    raise HTTPException(status_code=404, detail="Event not found")

@router.put("/events/{event_id}", response_model=dict)
async def update_event(
    event_id: int, 
    updated_event: EventUpdate, 
    current_org: dict = Depends(get_current_organization)
):
    """Updates an existing event with the provided data"""
    # Verify event exists and organization owns it
    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["organization"] != current_org["name"]:
        raise HTTPException(status_code=403, detail="Permission denied. You cannot update this event.")
    
    # Prepare update data
    update_data = updated_event.dict(exclude_unset=True)
    
    # Convert date fields if provided
    if "date" in update_data and isinstance(update_data["date"], datetime.date):
        update_data["date"] = datetime.datetime.combine(update_data["date"], datetime.time())
    
    if "registration_deadline" in update_data and isinstance(update_data["registration_deadline"], datetime.date):
        update_data["registration_deadline"] = datetime.datetime.combine(update_data["registration_deadline"], datetime.time())
    
    if "time" in update_data and isinstance(update_data["time"], datetime.time):
        update_data["time"] = update_data["time"].strftime("%H:%M:%S")
    
    # Update status if registration deadline is changed
    if "registration_deadline" in update_data:
        deadline_date = update_data["registration_deadline"].date()
        current_date = dt.now(timezone.utc).date()
        update_data["status"] = "Open" if deadline_date >= current_date else "Closed"
    
    # Perform the update
    result = events_collection.update_one(
        {"event_id": event_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event updated successfully"}

@router.delete("/events/{event_id}", response_model=dict)
async def delete_event(
    event_id: int, 
    current_org: dict = Depends(get_current_organization)
):
    """Deletes an event if the requesting organization owns it"""
    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["organization"] != current_org["name"]:
        raise HTTPException(status_code=403, detail="Permission denied. You cannot delete this event.")
    
    # Remove from organization's created_events list
    organizations_collection.update_one(
        {"_id": ObjectId(current_org["_id"])},
        {"$pull": {"created_events": str(event_id)}}
    )
    
    # Delete the event
    result = events_collection.delete_one({"event_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted successfully"}

@router.get("/events/filter", response_model=List[Event])
async def filter_events(
    category: Optional[str] = Query(None),
    organization: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    upcoming: Optional[bool] = Query(False)
):
    """
    Filters events based on provided query parameters
    """
    query = {"event_id": {"$type": "int"}}
    
    # Category filter
    if category and category.strip():
        categories = [c.strip() for c in category.split(",") if c.strip()]
        if len(categories) == 1:
            query["category"] = {"$regex": categories[0], "$options": "i"}
        else:
            query["category"] = {"$in": categories}
    
    # Organization filter
    if organization and organization.strip():
        query["organization"] = organization
    
    # Skills filter
    if skills and skills.strip():
        skill_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
        if skill_list:
            query["skills_required"] = {"$in": skill_list}
    
    # Search filter
    if search and search.strip():
        query["event_name"] = {"$regex": search, "$options": "i"}
    
    # Date filter
    if date and date.strip():
        query["date"] = date
    
    # Status filter
    if status and status.strip():
        query["status"] = {"$regex": status, "$options": "i"}
    
    # City filter
    if city and city.strip():
        query["city"] = {"$regex": city, "$options": "i"}
    
    # Upcoming events filter
    if upcoming:
        today = dt.now().strftime("%Y-%m-%d")
        query["date"] = {"$gte": today}
    
    events = list(events_collection.find(query))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/clear", response_model=List[Event])
async def clear_filters():
    """Returns all events (clearing any applied filters)"""
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/autocomplete", response_model=List[str])
async def autocomplete_events(search: str = Query(...)):
    """Returns event names for autocomplete suggestions"""
    query = {"event_name": {"$regex": f"^{search}", "$options": "i"}}
    suggestions = events_collection.distinct("event_name", query)
    return suggestions

@router.get("/events/total-events")
async def get_total_events():
    """
    Fetches the total number of events stored in the database.
    """
    total_events = events_collection.count_documents({})
    return {"total_events": total_events}

@router.post("/events/{event_id}/join")
async def join_event(
    event_id: int,
    user: dict = Depends(get_current_user),
):
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can join events.")

    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if the volunteer is already registered
    if "registered_volunteers" in event and str(user["user_id"]) in event["registered_volunteers"]:
        raise HTTPException(status_code=400, detail="You are already registered for this event.")

    # Add the volunteer to the event
    events_collection.update_one(
        {"event_id": event_id},
        {"$push": {"registered_volunteers": str(user["user_id"])},
        "$inc": {"total_registered_volunteers": 1}}
    )

    # Update the volunteer's registered_events list
    volunteers_collection.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$push": {"registered_events": str(event_id)}}
    )

    return {"message": "Successfully registered for the event!"}

@router.post("/events/{event_id}/leave", response_model=dict)
async def leave_event(
    event_id: int,
    user: dict = Depends(get_current_user)
):
    """Allows a volunteer to leave an event"""
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can leave events.")

    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if volunteer is registered
    if "registered_volunteers" not in event or str(user["user_id"]) not in event["registered_volunteers"]:
        raise HTTPException(status_code=400, detail="You are not registered for this event.")

    # Update event to remove volunteer
    events_collection.update_one(
        {"event_id": event_id},
        {
            "$pull": {"registered_volunteers": str(user["user_id"])},
            "$inc": {"total_registered_volunteers": -1}
        }
    )

    # Update volunteer's registered events
    volunteers_collection.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$pull": {"registered_events": str(event_id)}}
    )

    return {"message": "Successfully left the event."}

@router.get("/organization/events", response_model=List[Event])
async def get_organization_events(user: dict = Depends(get_current_user)):
    """Returns events created by the current organization"""
    try:
        if user["role"] != "organization":
            raise HTTPException(status_code=403, detail="Organization access only")

        org = organizations_collection.find_one({"_id": ObjectId(user["user_id"])})
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")

        events = list(events_collection.find({"organization": org["name"]}))
        return [Event(**event_serializer(event)) for event in events]
    except Exception as e:
        logging.error(f"Error fetching org events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch organization events")

@router.get("/volunteer/events", response_model=List[Event])
async def get_volunteer_events(user: dict = Depends(get_current_user)):
    """Returns events joined by the current volunteer"""
    try:
        if user["role"] != "volunteer":
            raise HTTPException(status_code=403, detail="Volunteer access only")

        volunteer = volunteers_collection.find_one({"_id": ObjectId(user["user_id"])})
        if not volunteer:
            raise HTTPException(status_code=404, detail="Volunteer not found")

        event_ids = volunteer.get("registered_events", [])
        events = list(events_collection.find({"event_id": {"$in": event_ids}}))
        return [Event(**event_serializer(event)) for event in events]
    except Exception as e:
        logging.error(f"Error fetching volunteer events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch volunteer events")