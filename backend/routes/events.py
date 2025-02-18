from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from database import events_collection
from models import Event
from geocoding import get_coordinates  # Import geocoding function

router = APIRouter()

# Convert MongoDB document to Python dictionary
def event_serializer(event) -> dict:
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
        "latitude": event.get("latitude", None),  # Prevent crash
        "longitude": event.get("longitude", None),  # Prevent crash
        "duration": event["duration"],
        "volunteer_requirements": event["volunteer_requirements"],
        "skills_required": event.get("skills_required", []),
        "contact_email": event["contact_email"],
        "contact_person": {
            "name": event["contact_person"]["name"],
            "contact_number": event["contact_person"]["contact_number"],
        },
        "image_url": event["image_url"],
        "registration_deadline": event["registration_deadline"],
        "additional_notes": event.get("additional_notes", ""),
        "status": event["status"],
        "total_registered_volunteers": event["total_registered_volunteers"],
        "created_at": event["created_at"],
    }

# Fetch all events
@router.get("/events", response_model=List[Event])
async def get_events():
    events = list(events_collection.find())
    return [event_serializer(event) for event in events]

# Fetch a single event by event_id
@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = events_collection.find_one({"event_id": event_id})
    if event:
        return event_serializer(event)
    raise HTTPException(status_code=404, detail="Event not found")

# Create an event with automatic location conversion
@router.post("/events", response_model=dict)
async def create_event(event: Event):
    """
    Adds a new event to the database and automatically converts the address to coordinates.
    """
    # Get coordinates from the address
    latitude, longitude = get_coordinates(event.address)

    # Update event with coordinates
    event_dict = event.dict()
    event_dict["latitude"] = latitude
    event_dict["longitude"] = longitude

    # Insert event into MongoDB
    events_collection.insert_one(event_dict)

    return {"message": "Event created successfully", "event_id": event.event_id}

# Fetch events with filters (case-insensitive)
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
    query = {}

    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if date:
        query["date"] = date
    if status:
        query["status"] = status
    if venue:
        query["venue"] = {"$regex": venue, "$options": "i"}
    if skills:
        skill_list = skills.split(",")
        query["skills_required"] = {"$in": skill_list}
    if search:
        query["event_name"] = {"$regex": search, "$options": "i"}

    print(f"🔍 Querying MongoDB with filters: {query}")  # ✅ Log query

    events = list(events_collection.find(query))
    print(f"✅ Events found: {len(events)}")  # ✅ Log number of matched events

    return [event_serializer(event) for event in events]
