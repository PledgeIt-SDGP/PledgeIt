from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile
from typing import List, Optional
from database import events_collection
from models import Event, ContactPerson
from geocoding import get_coordinates
import datetime
import os
import uuid
import uuid as uuid_lib  # For converting legacy UUID strings if needed

router = APIRouter()

# Ensure the uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def event_serializer(event) -> dict:
    """
    Converts a MongoDB event document into a dictionary for API responses.
    Ensures that the event_id is returned as an integer.
    """
    eid = event.get("event_id")
    if not isinstance(eid, int):
        try:
            eid = int(eid)
        except (ValueError, TypeError):
            try:
                eid = int(uuid_lib.UUID(eid))
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Invalid event_id format: {eid}")
    return {
        "event_id": eid,
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
        "image_url": f"http://127.0.0.1:8000{event.get('image_url', '')}",
        "registration_deadline": event["registration_deadline"],
        "additional_notes": event.get("additional_notes", ""),
        "status": event["status"],
        "total_registered_volunteers": event["total_registered_volunteers"],
        "created_at": event["created_at"],
    }

def get_next_event_id() -> int:
    """
    Returns the next event_id as the current count of events plus one.
    (Assumes that only documents with numeric event_id exist.)
    """
    count = events_collection.count_documents({"event_id": {"$type": "int"}})
    return count + 1

def renumber_events():
    """
    Renumbers all events in the database to maintain sequential event_ids.
    Called after an event is deleted.
    Only considers events with numeric event_id.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}).sort("created_at", 1))
    new_id = 1
    for event in events:
        events_collection.update_one({"_id": event["_id"]}, {"$set": {"event_id": new_id}})
        new_id += 1

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database that have a numeric event_id.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [event_serializer(event) for event in events]

@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: int):
    """
    Fetches a single event by its sequential event_id.
    Matches documents where event_id is stored as an integer or string.
    """
    event = events_collection.find_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if event:
        return event_serializer(event)
    raise HTTPException(status_code=404, detail="Event not found")

@router.post("/events", response_model=dict)
async def create_event(
    event_name: str = Form(...),
    organization: str = Form(...),
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
    status: str = Form(...),
    total_registered_volunteers: int = Form(...),
    image_url: UploadFile = File(...)
):
    """
    Creates a new event:
    - Generates a sequential event_id.
    - Converts the provided address to latitude and longitude.
    - Validates and uploads the event image.
    - Stores all event details in the database.
    """
    event_id = get_next_event_id()
    skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]
    latitude, longitude = get_coordinates(address)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="Unable to convert address to coordinates.")
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if image_url.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPG, JPEG, PNG allowed.")
    image_path = f"{UPLOAD_DIR}/{event_id}_{image_url.filename}"
    with open(image_path, "wb") as buffer:
        buffer.write(await image_url.read())
    image_url_path = f"/uploads/{event_id}_{image_url.filename}"
    
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
        "image_url": image_url_path,
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
    organization: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    venue: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Filters events based on the following parameters:
    - category: matches the event category (case-insensitive)
    - organization: matches the event's organization (case-insensitive)
    - skills: comma-separated list; event must have at least one matching skill
    - venue: matches the event venue (case-insensitive)
    - search: matches event names (case-insensitive)
    Only returns events with a numeric event_id.
    """
    query = {"event_id": {"$type": "int"}}
    if category and category.strip():
        query["category"] = {"$regex": category, "$options": "i"}
    if organization and organization.strip():
        query["organization"] = {"$regex": organization, "$options": "i"}
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

@router.get("/events/autocomplete", response_model=List[str])
async def autocomplete_events(search: str = Query(...)):
    """
    Returns a list of distinct event names starting with the search term (case-insensitive),
    useful for auto-prediction on the frontend.
    """
    query = {"event_name": {"$regex": f"^{search}", "$options": "i"}}
    suggestions = events_collection.distinct("event_name", query)
    return suggestions

@router.delete("/events/{event_id}")
async def delete_event(event_id: int):
    """
    Deletes an event by its event_id and renumbers remaining events sequentially.
    Matches documents where event_id is stored as an int or a string.
    """
    result = events_collection.delete_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    renumber_events()
    return {"message": "Event deleted successfully"}

@router.put("/events/{event_id}")
async def update_event(event_id: int, updated_event: Event):
    """
    Updates an existing event. Matches documents where event_id is stored as an int or a string.
    Raises a 404 error if no event is found with the given event_id.
    """
    result = events_collection.update_one(
        {"$or": [{"event_id": event_id}, {"event_id": str(event_id)}]},
        {"$set": updated_event.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}
