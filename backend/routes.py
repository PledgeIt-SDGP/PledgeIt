from fastapi import APIRouter, Depends, HTTPException, Header
from pymongo import MongoClient
from firebase_config import verify_firebase_token
from backend.models import Event
from backend.crud import create_event, get_events

router = APIRouter()

# Database connection
client = MongoClient("mongodb://localhost:27017/")
db = client["volunteer_db"]
users_collection = db["users"]

# Firebase authentication middleware
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization Header")

    token = authorization.split(" ")[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")

    return decoded_token

# User registration route (Requires Firebase authentication)
@router.post("/register")
async def register(user: dict, token_data=Depends(get_current_user)):
    user["email"] = token_data["email"]
    users_collection.insert_one(user)
    return {"message": "User registered successfully"}

# Event creation (Requires Firebase authentication)
@router.post("/events/")
async def add_event(event: Event, token_data=Depends(get_current_user)):
    return await create_event(event)

# Fetch all events (Public access)
@router.get("/events/")
async def fetch_events():
    return await get_events()
