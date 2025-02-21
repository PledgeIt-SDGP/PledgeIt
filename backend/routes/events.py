from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile
from typing import List, Optional
from database import events_collection  # Your MongoDB collection
from models import Event, ContactPerson
from geocoding import get_coordinates  # Helper function for geocoding
import datetime
import uuid
import os

router = APIRouter()

# Ensure the uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Convert MongoDB document to a Python dictionary for API responses
def event_serializer(event) -> dict:
    """
    Converts a MongoDB event document into a Python dictionary
    for API responses. The image_url is built as an absolute URL.
    """
    return {
        "event_id": event["event_id"],
        "event_name": event["event_name"],
        "organization": event["organization"],
        "description": event["description"],
        "category": event["category"],
        "date": event["date"],
        "time": event["time"],
        "venue": event["venue"],
        "city": event["city"],
        "address": event["address"],
        "latitude": event.get("latitude", None),
        "longitude": event.get("longitude", None),
        "duration": event["duration"],
        "volunteer_requirements": event.get("volunteer_requirements", ""),
        "skills_required": event.get("skills_required", []),
        "contact_email": event["contact_email"],
        "contact_person": {
            "name": event["contact_person"]["name"],
            "contact_number": event["contact_person"]["contact_number"],
        },
        # Return the full URL for the image so that the frontend can display it.
        "image_url": f"http://127.0.0.1:8000{event.get('image_url', '')}",
        "registration_deadline": event["registration_deadline"],
        "additional_notes": event.get("additional_notes", ""),
        "status": event["status"],
        "total_registered_volunteers": event["total_registered_volunteers"],
        "created_at": event["created_at"],
    }

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database and serializes them.
    """
    events = list(events_collection.find())
    return [event_serializer(event) for event in events]

# @router.get("/events", response_model=List[dict])
# async def get_events(
#     limit: int = Query(8, alias="limit"),  # ✅ Default limit to 8
#     skip: int = Query(0, alias="skip")     # ✅ Default start point at 0
# ):
#     """
#     Fetch paginated list of events.
#     The frontend will pass `limit` and `skip` values dynamically.
#     """
#     events = list(events_collection.find().skip(skip).limit(limit))
#     return [event_serializer(event) for event in events]

# ✅ Fetch a single event by event_id
@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    """
    Fetches a single event by its event_id.
    """
    event = events_collection.find_one({"event_id": event_id})
    if event:
        return event_serializer(event)
    raise HTTPException(status_code=404, detail="Event not found")

@router.post("/events", response_model=dict)
async def create_event(
    event_name: str = Form(...),
    organization: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    venue: str = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    duration: str = Form(...),
    volunteer_requirements: Optional[str] = Form(None),
    skills_required: str = Form(...),  # Comma-separated skills
    contact_email: str = Form(...),
    contact_person_name: str = Form(...),
    contact_person_number: str = Form(...),
    registration_deadline: str = Form(...),
    additional_notes: Optional[str] = Form(None),
    status: str = Form(...),
    total_registered_volunteers: int = Form(...),
    image_url: UploadFile = File(...)
):
    """
    Creates a new event. It generates a unique event_id, converts the provided address
    into latitude and longitude, validates and uploads the event image, and stores all data in the database.
    """
    # Generate unique event ID
    event_id = str(uuid.uuid4())
    # Convert skills string to list
    skills_list = skills_required.split(",")
    # Get coordinates using geocoding function
    latitude, longitude = get_coordinates(address)
    # Validate image type
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if image_url.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPG, JPEG, PNG allowed.")
    # Handle image upload: store image in local uploads directory
    image_path = f"{UPLOAD_DIR}/{event_id}_{image_url.filename}"
    with open(image_path, "wb") as buffer:
        buffer.write(await image_url.read())
    # Build URL path for the uploaded image
    image_url = f"/uploads/{event_id}_{image_url.filename}"
    
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
        "volunteer_requirements": volunteer_requirements,
        "skills_required": skills_list,
        "contact_email": contact_email,
        "contact_person": {
            "name": contact_person_name,
            "contact_number": contact_person_number
        },
        "image_url": image_url,
        "registration_deadline": registration_deadline,
        "additional_notes": additional_notes,
        "status": status,
        "total_registered_volunteers": total_registered_volunteers,
        "created_at": datetime.datetime.utcnow().isoformat(),
    }

    events_collection.insert_one(event_data)
    return {"message": "Event created successfully", "event_id": event_id}

@router.get("/events/filter", response_model=List[dict])
async def filter_events(
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    venue: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Filters events based on the provided query parameters.
    Uses case-insensitive regex for flexible matching and the $in operator for skills.
    """
    query = {}
    if category and category.strip():
        query["category"] = {"$regex": category, "$options": "i"}
    if city and city.strip():
        query["city"] = {"$regex": city, "$options": "i"}
    if date and date.strip():
        query["date"] = date
    if status and status.strip():
        query["status"] = status
    if venue and venue.strip():
        query["venue"] = {"$regex": venue, "$options": "i"}
    if skills and skills.strip():
        skill_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
        if skill_list:
            query["skills_required"] = {"$in": skill_list}
    if search and search.strip():
        query["event_name"] = {"$regex": search, "$options": "i"}
    
    print(f"🔍 MongoDB Query: {query}")
    events = list(events_collection.find(query))
    print(f"✅ Found {len(events)} matching events.")
    return [event_serializer(event) for event in events]

@router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """
    Deletes an event by its event_id.
    """
    result = events_collection.delete_one({"event_id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

@router.put("/events/{event_id}")
async def update_event(event_id: str, updated_event: Event):
    """
    Updates an existing event. If no event is found with the given event_id, raises a 404 error.
    """
    result = events_collection.update_one(
        {"event_id": event_id}, {"$set": updated_event.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}
