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

router = APIRouter()

# Create the uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a TTL index on the "expireAt" field for automatic event cleanup
events_collection.create_index("expireAt", expireAfterSeconds=0)

# Dependency for Organization Authentication
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

def get_current_organization(x_org_email: str = Header(None)):
    """Dependency to get the current authenticated organization"""
    if not x_org_email:
        raise HTTPException(status_code=401, detail="Missing authentication header.")

    client = MongoClient(os.getenv('MONGO_URI'))
    db = client[os.getenv('DB_NAME')]
    organizations_collection = db[os.getenv('ORGANIZATIONS_COLLECTION', 'organizations')]
    org = organizations_collection.find_one({"email": x_org_email})

    if not org:
        raise HTTPException(status_code=401, detail="Organization not found or not authorized")
    
    return org

def event_serializer(event) -> dict:
    """Helper function to serialize event data from MongoDB"""
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
        "expireAt": expire_at,
        "registered_volunteers": event.get("registered_volunteers", [])
    }

def get_next_event_id() -> int:
    """Returns the next sequential event_id"""
    count = events_collection.count_documents({"event_id": {"$type": "int"}})
    return count + 1

# ------------------------------
# Event Endpoints
# ------------------------------

@router.post("/events", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_name: str = Form(...),
    organization: str = Form("Demo Organization"),  # Default for testing
    description: str = Form(...),
    category: str = Form(...),
    date: str = Form(...),   # Format: YYYY-MM-DD
    time: str = Form(...),   # Format: HH:MM:SS
    venue: str = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    duration: str = Form(...),
    volunteer_requirements: Optional[str] = Form(None),
    skills_required: str = Form(...),  # Comma-separated list
    contact_email: EmailStr = Form(...),
    contact_person_name: str = Form(...),
    contact_person_number: str = Form(...),
    registration_deadline: str = Form(...),  # Format: YYYY-MM-DD
    additional_notes: Optional[str] = Form(None),
    image_url: UploadFile = File(...),
    current_org: dict = Depends(get_current_organization)
):
    """
    Creates a new event with the provided form data.
    - Generates a sequential event_id
    - Overrides organization with authenticated organization's name
    - Converts address to coordinates
    - Validates and uploads image
    - Sets status based on registration deadline
    - Sets expireAt for automatic deletion
    """
    # Override organization with authenticated organization's name
    organization = current_org["name"]

    # Validate required fields
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
            raise HTTPException(status_code=400, detail=f"{field.replace('_', ' ').title()} cannot be empty.")

    # Validate email format
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    is_email_valid = bool(re.fullmatch(pattern, contact_email.strip()))

    if(is_email_valid == False):
        raise HTTPException(status_code=400, detail="Invalid contact email format.")

    # try:
    #     email = contact_email.strip().lower()  
    #     EmailStr.validate(email)
    # except:
    #     raise HTTPException(status_code=400, detail="Invalid contact email format.")

    # Validate date/time formats
    try:
        datetime.datetime.strptime(date, 
                                   "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")
    
    try:
        if len(time.strip()) == 5:
            datetime.datetime.strptime(time + ":00", "%H:%M:%S")
        else:
            datetime.datetime.strptime(time, "%H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Expected HH:MM:SS or HH:MM.")
    
    try:
        datetime.datetime.strptime(registration_deadline, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid registration deadline format. Expected YYYY-MM-DD.")

    # Validate image
    if not image_url.filename:
        raise HTTPException(status_code=400, detail="Uploaded image must have a filename.")
    
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if image_url.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPG, JPEG, PNG allowed.")
    
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    ext = os.path.splitext(image_url.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid image file extension.")

    # Process volunteer requirements
    try:
        max_capacity = int(volunteer_requirements) if volunteer_requirements else 0
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid volunteer_requirements format. Expected an integer.")

    # Generate event ID and process skills
    event_id = get_next_event_id()
    skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]

    # Map category if needed
    category_mapping = {
        "1": "Environmental",
        "2": "Community Service",
        "3": "Education",
        "4": "Healthcare",
        "5": "Animal Welfare",
        "6": "Disaster Relief",
        "7": "Lifestyle & Culture",
        "8": "Fundraising & Charity"
    }
    if category in category_mapping:
        category = category_mapping[category]

    # Get coordinates from address
    latitude, longitude = get_coordinates(address)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="Invalid address. Please add a valid address.")

    # Upload image to Cloudinary
    try:
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET")
        )
        public_id = f"{event_id}_{os.path.splitext(image_url.filename)[0]}"
        upload_result = cloudinary.uploader.upload(await image_url.read(), public_id=public_id, resource_type="image")
        image_url_path = upload_result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")

    # Determine event status and expiration
    deadline_date = dt.strptime(registration_deadline, "%Y-%m-%d").date()
    current_date = dt.now(timezone.utc).date()  
    status = "Open" if deadline_date >= current_date else "Closed"
    total_registered_volunteers = 0
    
    event_datetime = dt.strptime(f"{date} {time if len(time.strip()) > 5 else time + ':00'}", "%Y-%m-%d %H:%M:%S")
    expireAt = event_datetime + timedelta(days=1)

    # Prepare event data
    event_data = {
        "event_id": event_id,
        "event_name": event_name,
        "organization": organization,
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
        "total_registered_volunteers": total_registered_volunteers,
        "created_at": dt.now(timezone.utc).isoformat(),  
        "expireAt": expireAt,
        "registered_volunteers": []
    }

    # Save to database and update organization's events list
    try:
        events_collection.insert_one(event_data)
        organizations_collection.update_one(
            {"_id": ObjectId(current_org["_id"])},
            {"$push": {"created_events": str(event_id)}}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Send QR code email to organization
    try:
        email_service = EmailService()
        email_service.send_event_qr_to_organization(
            event_id=event_id,
            event_name=event_name,
            organization_email=current_org["email"],
            event_details=event_data
        )
    except Exception as e:
        logging.error(f"Failed to send QR code email to organization: {e}")

    return {"message": "Event created successfully", "event_id": event_id}

@router.get("/events", response_model=List[Event])
async def get_events():
    """Fetches all events from the database with a numeric event_id"""
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
    Filters events based on provided query parameters:
    - category: Event category (comma-separated values)
    - organization: Exact organization name
    - skills: Comma-separated skills list
    - search: Case-insensitive search on event names
    - date: Exact match on event date
    - status: Event status
    - city: Case-insensitive city match
    - upcoming: Only return upcoming events
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

@router.get("/events/total-events", response_model=dict)
async def get_total_events():
    """Returns the total count of events"""
    total_events = events_collection.count_documents({"event_id": {"$type": "int"}})
    return {"total_events": total_events}

@router.post("/events/{event_id}/join", response_model=dict)
async def join_event(
    event_id: int,
    user: dict = Depends(get_current_user)
):
    """Allows a volunteer to join an event"""
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can join events.")

    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if volunteer is already registered
    if "registered_volunteers" in event and str(user["user_id"]) in event["registered_volunteers"]:
        raise HTTPException(status_code=400, detail="You are already registered for this event.")

    # Check if event is full
    if event.get("volunteer_requirements", 0) > 0 and \
       event.get("total_registered_volunteers", 0) >= event["volunteer_requirements"]:
        raise HTTPException(status_code=400, detail="This event has reached its volunteer capacity.")

    # Check registration deadline
    deadline = dt.strptime(event["registration_deadline"], "%Y-%m-%d").date()
    if deadline < dt.now(timezone.utc).date():
        raise HTTPException(status_code=400, detail="Registration deadline has passed.")

    # Update event with new volunteer
    events_collection.update_one(
        {"event_id": event_id},
        {
            "$push": {"registered_volunteers": str(user["user_id"])},
            "$inc": {"total_registered_volunteers": 1}
        }
    )

    # Update volunteer's registered events
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
    """Returns all events created by the current organization"""
    if user["role"] != "organization":
        raise HTTPException(status_code=403, detail="Only organizations can access this endpoint.")

    organization = organizations_collection.find_one({"_id": ObjectId(user["user_id"])})
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    event_ids = organization.get("created_events", [])
    events = list(events_collection.find({"event_id": {"$in": event_ids}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/volunteer/events", response_model=List[Event])
async def get_volunteer_events(user: dict = Depends(get_current_user)):
    """Returns all events the current volunteer has joined"""
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can access this endpoint.")

    volunteer = volunteers_collection.find_one({"_id": ObjectId(user["user_id"])})
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    event_ids = volunteer.get("registered_events", [])
    events = list(events_collection.find({"event_id": {"$in": event_ids}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/{event_id}/volunteers", response_model=List[dict])
async def get_event_volunteers(
    event_id: int,
    user: dict = Depends(get_current_user)
):
    """Returns the list of volunteers registered for an event (organization only)"""
    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Only organization that created the event can see volunteers
    if user["role"] != "organization" or event["organization"] != user["name"]:
        raise HTTPException(status_code=403, detail="Permission denied.")

    volunteer_ids = event.get("registered_volunteers", [])
    volunteers = list(volunteers_collection.find(
        {"_id": {"$in": [ObjectId(vid) for vid in volunteer_ids]}},
        {"name": 1, "email": 1, "skills": 1, "profile_picture": 1}
    ))

    return [{
        "name": v.get("name"),
        "email": v.get("email"),
        "skills": v.get("skills", []),
        "profile_picture": v.get("profile_picture")
    } for v in volunteers]

@router.post("/events/{event_id}/scan", response_model=dict)
async def scan_event_qr(
    event_id: int,
    user: dict = Depends(get_current_user)
):
    """Endpoint for scanning event QR codes to confirm participation"""
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can scan QR codes.")

    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if volunteer is registered for the event
    if "registered_volunteers" not in event or str(user["user_id"]) not in event["registered_volunteers"]:
        raise HTTPException(status_code=400, detail="You are not registered for this event.")

    # Check if event is happening today
    event_date = dt.strptime(event["date"], "%Y-%m-%d").date()
    current_date = dt.now(timezone.utc).date()
    if event_date != current_date:
        raise HTTPException(
            status_code=400,
            detail=f"Event is not today. Event date: {event_date.strftime('%B %d, %Y')}"
        )

    # Send participation confirmation email
    try:
        email_service = EmailService()
        email_service.send_participation_confirmation(
            volunteer_email=user["email"],
            volunteer_name=user["name"],
            event_name=event["event_name"],
            event_details=event
        )
    except Exception as e:
        logging.error(f"Failed to send participation confirmation: {e}")

    return {"message": "Participation confirmed successfully!"}