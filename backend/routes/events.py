from fastapi import APIRouter, HTTPException, Query
from typing import List
from database import events_collection
from models import Event
from bson import ObjectId

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
        "duration": event["duration"],
        "volunteer_requirements": event["volunteer_requirements"],
        "skills_required": event["skills_required"],
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

# Fetch a single event by ID
@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    event = events_collection.find_one({"event_id": event_id})
    if event:
        return event_serializer(event)
    raise HTTPException(status_code=404, detail="Event not found")

# Fetch events based on filters
@router.get("/events/filter", response_model=List[Event])
async def filter_events(
    category: str = Query(None),
    city: str = Query(None),
    date: str = Query(None),
    status: str = Query(None),
):
    query = {}

    if category:
        query["category"] = category
    if city:
        query["city"] = city
    if date:
        query["date"] = date
    if status:
        query["status"] = status

    events = list(events_collection.find(query))
    return [event_serializer(event) for event in events]
