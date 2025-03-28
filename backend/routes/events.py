import logging
from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile, Depends, Header
from typing import List, Optional
from database.database import events_collection
from models.models import Event
from models.update_models import EventUpdate  # Importing the partial update model
from services.geocoding import get_coordinates
import datetime
import os
import uuid as uuid_lib  
import cloudinary
import cloudinary.uploader
from routes.auth import get_current_user
from routes.auth import organizations_collection, volunteers_collection
from bson import ObjectId

router = APIRouter()

# Create the uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a TTL index on the "expireAt" field.
# This ensures that events are automatically deleted after the expireAt time is reached.
events_collection.create_index("expireAt", expireAfterSeconds=0)

# Dependency for Organization Authentication
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from the .env file
load_dotenv()

def get_current_organization(x_org_email: str = Header(None)):
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
    from datetime import datetime

    try:
        volunteer_requirements = str(event.get("volunteer_requirements", ""))
        expire_at = event.get("expireAt")
        if isinstance(expire_at, datetime):
            expire_at = expire_at.isoformat()  # Convert datetime to ISO string
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
    """
    Returns the next sequential event_id.
    This is calculated by counting the events with a numeric event_id and adding one.
    """
    count = events_collection.count_documents({"event_id": {"$type": "int"}})
    return count + 1

# ------------------------------
# Endpoints
# ------------------------------

@router.get("/events/filter", response_model=List[Event])
async def filter_events(
    category: Optional[str] = Query(None),
    organization: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None)  
):
    """
    Filters events based on provided query parameters:
    - category: Event category (supports comma-separated values and case-insensitive matching)
    - organization: Exact match for the event's organization
    - skills: Comma-separated list; event must include at least one matching skill
    - search: Case-insensitive search on event names
    - date: Exact match on event date
    - status: Case-insensitive match on event status
    - city: Case-insensitive match on event city
    Only events with a numeric event_id are returned.
    """
    query = {"event_id": {"$type": "int"}}
    if category and category.strip():
        categories = [c.strip() for c in category.split(",") if c.strip()]
        if len(categories) == 1:
            query["category"] = {"$regex": categories[0], "$options": "i"}
        else:
            query["category"] = {"$in": categories}
    if organization and organization.strip():
        query["organization"] = organization
    if skills and skills.strip():
        skill_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
        if skill_list:
            query["skills_required"] = {"$in": skill_list}
    if search and search.strip():
        query["event_name"] = {"$regex": search, "$options": "i"}
    if date and date.strip():
        query["date"] = date
    if status and status.strip():
        query["status"] = {"$regex": status, "$options": "i"}
    if city and city.strip():
        query["city"] = {"$regex": city, "$options": "i"}
    
    print(f"MongoDB Query: {query}")
    events = list(events_collection.find(query))
    print(f"Found {len(events)} matching events.")
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/clear", response_model=List[Event])
async def clear_filters():
    """
    Returns all events (clearing any applied filters).
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database with a numeric event_id.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/autocomplete", response_model=List[str])
async def autocomplete_events(search: str = Query(...)):
    """
    Returns a list of distinct event names that start with the provided search term (case-insensitive).
    This endpoint is useful for implementing autocomplete features on the frontend.
    """
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

@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    """
    Fetches a single event by its sequential event_id.
    Matches documents where event_id is stored as an integer or as a string.
    Raises a 404 error if no matching event is found.
    """
    event = events_collection.find_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if event:
        return Event(**event_serializer(event))
    raise HTTPException(status_code=404, detail="Event not found")

@router.post("/events", response_model=dict)
async def create_event(
    event_name: str = Form(...),
    organization: str = Form("Demo Organization"),  # Default organization for testing
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
    contact_email: str = Form(...),
    contact_person_name: str = Form(...),
    contact_person_number: str = Form(...),
    registration_deadline: str = Form(...),  # Format: YYYY-MM-DD
    additional_notes: Optional[str] = Form(None),
    image_url: UploadFile = File(...),
    current_org: dict = Depends(get_current_organization)
):
    """
    Creates a new event with the provided form data.
    - Generates a sequential event_id.
    - Overrides the organization with the authenticated organization's name.
    - Converts the address into latitude and longitude.
    - Validates the uploaded image format and saves the file.
    - Determines the event status based on the registration deadline.
    - Sets total_registered_volunteers to 0.
    - Sets the event's expireAt field for automatic deletion one day after the event starts.
    """

    # Override organization with authenticated organization's name
    organization = current_org["name"]

    # ------------------------------
    # Additional Validations Start
    # ------------------------------
    if not event_name.strip():
        raise HTTPException(status_code=400, detail="Event name cannot be empty.")
    if not description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty.")
    if not category.strip():
        raise HTTPException(status_code=400, detail="Category cannot be empty.")
    if not date.strip():
        raise HTTPException(status_code=400, detail="Date cannot be empty.")
    if not time.strip():
        raise HTTPException(status_code=400, detail="Time cannot be empty.")
    if not venue.strip():
        raise HTTPException(status_code=400, detail="Venue cannot be empty.")
    if not city.strip():
        raise HTTPException(status_code=400, detail="City cannot be empty.")
    if not address.strip():
        raise HTTPException(status_code=400, detail="Address cannot be empty.")
    if not duration.strip():
        raise HTTPException(status_code=400, detail="Duration cannot be empty.")
    if not skills_required.strip():
        raise HTTPException(status_code=400, detail="Skills required cannot be empty.")
    if not contact_email.strip():
        raise HTTPException(status_code=400, detail="Contact email cannot be empty.")
    if not contact_person_name.strip():
        raise HTTPException(status_code=400, detail="Contact person name cannot be empty.")
    if not contact_person_number.strip():
        raise HTTPException(status_code=400, detail="Contact person number cannot be empty.")
    if not registration_deadline.strip():
        raise HTTPException(status_code=400, detail="Registration deadline cannot be empty.")

    import re
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_regex, contact_email):
        raise HTTPException(status_code=400, detail="Invalid contact email format.")
    try:
        datetime.datetime.strptime(date, "%Y-%m-%d")
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
    if not image_url.filename:
         raise HTTPException(status_code=400, detail="Uploaded image must have a filename.")
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if image_url.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPG, JPEG, PNG allowed.")
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    ext = os.path.splitext(image_url.filename)[1].lower()
    if ext not in allowed_extensions:
         raise HTTPException(status_code=400, detail="Invalid image file extension.")
    try:
         max_capacity = int(volunteer_requirements) if volunteer_requirements else 0
    except ValueError:
         raise HTTPException(status_code=400, detail="Invalid volunteer_requirements format. Expected an integer representing maximum capacity.")
    event_id = get_next_event_id()
    skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]
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
    latitude, longitude = get_coordinates(address)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="Invalid address. Please add a valid address.")
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
    from datetime import datetime as dt, timedelta, timezone
    deadline_date = dt.strptime(registration_deadline, "%Y-%m-%d").date()
    current_date = dt.now(timezone.utc).date()  
    status = "Open" if deadline_date >= current_date else "Closed"
    total_registered_volunteers = 0
    event_datetime = dt.strptime(f"{date} {time if len(time.strip()) > 5 else time + ':00'}", "%Y-%m-%d %H:%M:%S")
    expireAt = event_datetime + timedelta(days=1)
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
        "expireAt": expireAt  
    }

    organizations_collection.update_one(
        {"_id": ObjectId(current_org["_id"])},
        {"$push": {"created_events": str(event_id)}}
    )
    
    events_collection.insert_one(event_data)
    try:
        from services.qr_email_handler import send_event_qr_to_organization
        send_event_qr_to_organization(event_id, current_org["email"])
    except Exception as e:
        logging.error(f"Failed to send QR code email to organization: {e}")
    return {"message": "Event created successfully", "event_id": event_id}

@router.delete("/events/{event_id}")
async def delete_event(event_id: int, current_org: dict = Depends(get_current_organization)):
    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["organization"] != current_org["name"]:
        raise HTTPException(status_code=403, detail="Permission denied. You cannot delete this event.")
    result = events_collection.delete_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

@router.patch("/events/{event_id}")
async def update_event(event_id: int, updated_event: EventUpdate, current_org: dict = Depends(get_current_organization)):
    """
    Updates an existing event using the provided event data.
    Matches documents where event_id is stored as an integer or as a string.
    If no event is found with the given event_id, a 404 error is raised.
    """
    # Fetch the event from the database to verify ownership
    event = events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["organization"] != current_org["name"]:
        raise HTTPException(status_code=403, detail="Permission denied. You cannot update this event.")
    
    # Use only provided fields for update
    update_data = updated_event.dict(exclude_unset=True)
    
    if "date" in update_data and isinstance(update_data["date"], datetime.date) and not isinstance(update_data["date"], datetime.datetime):
        update_data["date"] = datetime.datetime.combine(update_data["date"], datetime.time())
    if "registration_deadline" in update_data and isinstance(update_data["registration_deadline"], datetime.date) and not isinstance(update_data["registration_deadline"], datetime.datetime):
        update_data["registration_deadline"] = datetime.datetime.combine(update_data["registration_deadline"], datetime.time())
    if "time" in update_data and isinstance(update_data["time"], datetime.time):
        update_data["time"] = update_data["time"].strftime("%H:%M:%S")
    
    result = events_collection.update_one(
        {"$or": [{"event_id": event_id}, {"event_id": str(event_id)}]},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database with a numeric event_id.
    Returns events serialized according to the Event model.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

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

@router.get("/organization/events")
async def get_organization_events(user: dict = Depends(get_current_user)):
    if user["role"] != "organization":
        raise HTTPException(status_code=403, detail="Only organizations can access this endpoint.")

    organization = organizations_collection.find_one({"_id": ObjectId(user["user_id"])})
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    event_ids = organization.get("created_events", [])
    events = list(events_collection.find({"event_id": {"$in": event_ids}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/volunteer/events")
async def get_volunteer_events(user: dict = Depends(get_current_user)):
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers can access this endpoint.")

    volunteer = volunteers_collection.find_one({"_id": ObjectId(user["user_id"])})
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    event_ids = volunteer.get("registered_events", [])
    events = list(events_collection.find({"event_id": {"$in": event_ids}}))
    return [Event(**event_serializer(event)) for event in events]