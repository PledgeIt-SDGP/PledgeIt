from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile
from typing import List, Optional
from database import events_collection
from models import Event, ContactPerson
from geocoding import get_coordinates
import datetime
import os
import uuid
import uuid as uuid_lib  # For converting legacy UUID strings if needed 
import json
from dotenv import load_dotenv  # For loading environment variables from .env file

#Load environment variables from .env file
load_dotenv("../PledgeIt/e.env")

router = APIRouter()

# Ensure the uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Get the DeepSeek API key from the .env file
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

def calculate_social_impact_score(description: str) -> float:
    """
    calls Deepseek API to analyze the event description and return social impact score.

    """

    try:
        url = "https://api.deepseek.com/v1/chat/completions"

        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        prompt = f"""Analyze the following volunteer event description and provide a social impact score out of 10.
        Consider factors like environmental benefit, community development, education, and long-term positive impact.
        Respond with ONLY a number between 0 and 10, with no explanation or additional text.

        Event description: {description}

        Social Impact Score (0-10): """

        data = {
            "model":"deepseek-chat",
            "messages": [{"role": "user", "content":prompt}],
            "temperature":0.3,
            "max_tokens": 10
        }

        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()

        response_data = response.json()
        score_text = response_data["chioces"][0]["message"]["content"].strip()

        # Extract the numeric value (handling potential formatting issues)
        score = 0
        for word in score_text.split():
            try:
                score = float(word)
                break
            except ValueError:
                continue
                
        return min(max(score, 0), 10)  # Ensure score is between 0 and 10
    except Exception as e:
        print(f"Error calculating social impact score: {e}")
        return 5.0  # Default score if API fails
    
    def calculate_xp_points(social_impact_score: float, duration: str) -> int:
        """
        Calculates the experience points based on the social impact score and event duration.
        """
    try:
        # Extract numeric value from duration (e.g., "5 hours" -> 5)
        duration_parts = duration.split()
        duration_hours = float(duration_parts[0])
        
        # Handle different time units if needed
        if len(duration_parts) > 1 and "minute" in duration_parts[1].lower():
            duration_hours = duration_hours / 60
        elif len(duration_parts) > 1 and "day" in duration_parts[1].lower():
            duration_hours = duration_hours * 24
            
        xp = (social_impact_score / 10) * (duration_hours * 10)
        return int(xp)
    except Exception as e:
        print(f"Error calculating XP points: {e}")
        return 0  # Default XP if calculation fails

def event_serializer(event) -> dict:
    """
    Converts a MongoDB event document into a dictionary for API responses.
    Ensures that the event_id is returned as an integer and converts
    date/time strings into proper Python objects.
    """
    from datetime import datetime

    eid = event.get("event_id")
    if not isinstance(eid, int):
        try:
            eid = int(eid)
        except (ValueError, TypeError):
            try:
                eid = int(uuid_lib.UUID(eid))
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Invalid event_id format: {eid}")
    
    try:
        event_date = (
            datetime.strptime(event["date"], "%Y-%m-%d").date()
            if isinstance(event.get("date"), str)
            else event.get("date")
        )
        # Handle time string that may be in HH:MM format
        time_str = event["time"]
        if isinstance(time_str, str):
            if len(time_str.strip()) == 5:
                time_str += ":00"
            event_time = datetime.strptime(time_str, "%H:%M:%S").time()
        else:
            event_time = event.get("time")
        reg_deadline = (
            datetime.strptime(event["registration_deadline"], "%Y-%m-%d").date()
            if isinstance(event.get("registration_deadline"), str)
            else event.get("registration_deadline")
        )
        created_at_val = (
            datetime.fromisoformat(event["created_at"])
            if isinstance(event.get("created_at"), str)
            else event.get("created_at")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing date/time fields: {e}")

    return {
        "event_id": eid,
        "event_name": event["event_name"],
        "organization": event["organization"],
        "description": event["description"],
        "category": event["category"],
        "date": event_date,
        "time": event_time,
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
        "registration_deadline": reg_deadline,
        "additional_notes": event.get("additional_notes", ""),
        "status": event["status"],
        "total_registered_volunteers": event["total_registered_volunteers"],
        "created_at": created_at_val,
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

@router.get("/events/filter", response_model=List[Event])
async def filter_events(
    category: Optional[str] = Query(None),
    organization: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    venue: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    """
    Filters events based on the following parameters:
    - category: matches the event category (case-insensitive). If multiple categories are provided (comma-separated),
      any event with a category matching any of the values will be returned.
    - organization: matches the event's organization (using an exact match)
    - skills: comma-separated list; event must have at least one matching skill
    - venue: matches the event venue (case-insensitive)
    - search: matches event names (case-insensitive)
    - date: matches the event date (exact match)
    - status: matches the event status (case-insensitive)
    Only returns events with a numeric event_id.
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
    if venue and venue.strip():
        query["venue"] = {"$regex": venue, "$options": "i"}
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
    
    print(f"🔍 MongoDB Query: {query}")
    events = list(events_collection.find(query))
    print(f"✅ Found {len(events)} matching events.")
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events/clear", response_model=List[Event])
async def clear_filters():
    """
    Returns all events, effectively clearing any applied filters.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

@router.get("/events", response_model=List[Event])
async def get_events():
    """
    Fetches all events from the database that have a numeric event_id.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}))
    return [Event(**event_serializer(event)) for event in events]

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
    image_url: UploadFile = File(...)
):
    """
    Creates a new event:
    - Generates a sequential event_id.
    - Converts the provided address to latitude and longitude.
    - Validates and uploads the event image.
    - Automatically determines the status based on the registration deadline.
    - Automatically initializes the total_registered_volunteers to 0.
    - Stores all event details in the database.
    """
    event_id = get_next_event_id()
    skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]

    # Map category id to category name if needed
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

    # Convert address to coordinates
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
    
    # Compute status based on registration deadline
    from datetime import datetime
    deadline_date = datetime.strptime(registration_deadline, "%Y-%m-%d").date()
    current_date = datetime.utcnow().date()
    status = "Open" if deadline_date >= current_date else "Closed"
    
    # Automatically initialize total_registered_volunteers to 0
    total_registered_volunteers = 0

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
        "created_at": datetime.utcnow().isoformat(),
    }

    events_collection.insert_one(event_data)
    return {"message": "Event created successfully", "event_id": event_id}

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
