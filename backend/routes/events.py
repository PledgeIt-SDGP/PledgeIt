from fastapi import APIRouter, HTTPException, Query, Form, File, UploadFile, Depends, Header
from typing import List, Optional
from database import events_collection
from models import Event, ContactPerson
from geocoding import get_coordinates
import datetime
import os
import uuid
import uuid as uuid_lib  # For converting legacy UUID strings if needed

router = APIRouter()

# ------------------------------
# Setup and Configuration
# ------------------------------

# Create the uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a TTL index on the "expireAt" field.
# This ensures that events are automatically deleted after the expireAt time is reached.
events_collection.create_index("expireAt", expireAfterSeconds=0)

# ------------------------------
# Dependency for Organization Authentication
# ------------------------------
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from a .env file
load_dotenv()

def get_current_organization(x_org_email: str = Header(None)):
    """
    Dependency that extracts the authenticated organization's email from the header.
    Looks up the organization in the organizations collection.
    Raises a 401 error if the header is missing or if the organization is not found.
    """
    if not x_org_email:
         raise HTTPException(status_code=401, detail="Missing X-Org-Email header for organization authentication")
    client = MongoClient(os.getenv('MONGO_URI'))
    db = client[os.getenv('DB_NAME')]
    organizations_collection = db[os.getenv('ORGANIZATIONS_COLLECTION')]
    org = organizations_collection.find_one({"email": x_org_email})
    if not org:
         raise HTTPException(status_code=401, detail="Organization not found or not authorized")
    return org

# ------------------------------
# Helper Functions
# ------------------------------

def event_serializer(event) -> dict:
    """
    Converts a MongoDB event document into a dictionary for API responses.
    - Ensures that event_id is returned as an integer (converting if needed).
    - Parses date/time strings into proper Python date/time objects.
    Raises a 500 error if event_id format or date/time fields are invalid.
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
        # Handle time string that may be in HH:MM format (append seconds if necessary)
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
    Returns the next sequential event_id.
    This is calculated by counting the events with a numeric event_id and adding one.
    """
    count = events_collection.count_documents({"event_id": {"$type": "int"}})
    return count + 1

def renumber_events():
    """
    Renumbers all events in the database to maintain sequential event_ids.
    This function is called after an event is deleted.
    Only events with numeric event_id are considered.
    """
    events = list(events_collection.find({"event_id": {"$type": "int"}}).sort("created_at", 1))
    new_id = 1
    for event in events:
        events_collection.update_one({"_id": event["_id"]}, {"$set": {"event_id": new_id}})
        new_id += 1

# ------------------------------
# Endpoints
# ------------------------------

@router.get("/events/filter", response_model=List[Event])
async def filter_events(
    category: Optional[str] = Query(None),
    organization: Optional[str] = Query(None),
    skills: Optional[str] = Query(None),
    # Removed the venue parameter and its filtering logic.
    search: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None)  # Using city as the filter parameter
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
    
    print(f"🔍 MongoDB Query: {query}")
    events = list(events_collection.find(query))
    print(f"✅ Found {len(events)} matching events.")
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

    # Validate that required text fields are not empty or whitespace only.
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

    # Validate email format for contact_email using a simple regex.
    import re
    email_regex = r"[^@]+@[^@]+\.[^@]+"
    if not re.match(email_regex, contact_email):
        raise HTTPException(status_code=400, detail="Invalid contact email format.")

    # Validate date format for 'date' field.
    try:
        datetime.datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD.")

    # Validate time format for 'time' field (supporting HH:MM:SS or HH:MM).
    try:
        if len(time.strip()) == 5:
            datetime.datetime.strptime(time + ":00", "%H:%M:%S")
        else:
            datetime.datetime.strptime(time, "%H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Expected HH:MM:SS or HH:MM.")

    # Validate date format for 'registration_deadline' field.
    try:
        datetime.datetime.strptime(registration_deadline, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid registration deadline format. Expected YYYY-MM-DD.")

    # Validate that an image file has been uploaded and has a filename.
    if not image_url.filename:
         raise HTTPException(status_code=400, detail="Uploaded image must have a filename.")

    # Validate uploaded image file type via content_type and file extension.
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if image_url.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPG, JPEG, PNG allowed.")
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    ext = os.path.splitext(image_url.filename)[1].lower()
    if ext not in allowed_extensions:
         raise HTTPException(status_code=400, detail="Invalid image file extension.")

    # ------------------------------
    # Additional Validations End
    # ------------------------------

    # Generate the next sequential event ID
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

    # Convert address to coordinates (latitude and longitude)
    latitude, longitude = get_coordinates(address)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="Unable to convert address to coordinates.")
    
    # Save the uploaded image file to the uploads directory
    image_path = f"{UPLOAD_DIR}/{event_id}_{image_url.filename}"
    with open(image_path, "wb") as buffer:
        buffer.write(await image_url.read())
    image_url_path = f"/uploads/{event_id}_{image_url.filename}"
    
    # Compute event status based on registration deadline
    from datetime import datetime, timedelta
    deadline_date = datetime.strptime(registration_deadline, "%Y-%m-%d").date()
    current_date = datetime.utcnow().date()
    status = "Open" if deadline_date >= current_date else "Closed"
    
    # Initialize total registered volunteers to 0
    total_registered_volunteers = 0

    # Calculate event's expireAt field (for automatic deletion one day after event start)
    event_datetime = datetime.strptime(f"{date} {time if len(time.strip()) > 5 else time + ':00'}", "%Y-%m-%d %H:%M:%S")
    expireAt = event_datetime + timedelta(days=1)
    
    # Construct the event data dictionary to be inserted into the database
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
        "expireAt": expireAt  # Added expireAt field for automatic deletion
    }

    # Insert the new event into the MongoDB collection
    events_collection.insert_one(event_data)
    return {"message": "Event created successfully", "event_id": event_id}

@router.get("/events/autocomplete", response_model=List[str])
async def autocomplete_events(search: str = Query(...)):
    """
    Returns a list of distinct event names that start with the provided search term (case-insensitive).
    This endpoint is useful for implementing autocomplete features on the frontend.
    """
    query = {"event_name": {"$regex": f"^{search}", "$options": "i"}}
    suggestions = events_collection.distinct("event_name", query)
    return suggestions

@router.delete("/events/{event_id}")
async def delete_event(event_id: int):
    """
    Deletes an event by its event_id.
    The query matches documents where event_id is stored as an integer or as a string.
    After deletion, it calls renumber_events() to maintain sequential event_ids.
    Raises a 404 error if no matching event is found.
    """
    result = events_collection.delete_one({
        "$or": [{"event_id": event_id}, {"event_id": str(event_id)}]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    # Renumber remaining events to maintain sequential IDs
    renumber_events()
    return {"message": "Event deleted successfully"}

@router.put("/events/{event_id}")
async def update_event(event_id: int, updated_event: Event):
    """
    Updates an existing event using the provided event data.
    Matches documents where event_id is stored as an integer or as a string.
    If no event is found with the given event_id, a 404 error is raised.
    """
    result = events_collection.update_one(
        {"$or": [{"event_id": event_id}, {"event_id": str(event_id)}]},
        {"$set": updated_event.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated successfully"}
