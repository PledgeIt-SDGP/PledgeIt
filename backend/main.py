from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://pledgeit_user_1:Haapuw3TFSmaO9Ts@pledgeit.purpn.mongodb.net/?retryWrites=true&w=majority")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["pledgeit_database"]
collection = db["events"]

# Helper function to convert MongoDB document to a dictionary
def serialize_event(event):
    return {
        "id": str(event["_id"]),
        "event_id": event["event_id"],
        "event_name": event["event_name"],
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
        "contact_personal": event["contact_personal"],
        "contact_number": event["contact_number"],
        "image_url": event["image_url"],
        "registration_deadline": event["registration_deadline"],
        "additional_notes": event["additional_notes"],
        "status": event["status"],
        "total_registered_volunteers": event["total_registered_volunteers"],
        "created_at": event["created_at"],
        "latitude": event["latitude"],
        "longitude": event["longitude"],
    }

# Route to fetch all events
@app.get("/events")
async def get_events():
    try:
        events = list(collection.find({}))
        return [serialize_event(event) for event in events]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to fetch a single event by event_id
@app.get("/events/{event_id}")
async def get_event(event_id: int):
    event = collection.find_one({"event_id": event_id})
    if event:
        return serialize_event(event)
    raise HTTPException(status_code=404, detail="Event not found")

