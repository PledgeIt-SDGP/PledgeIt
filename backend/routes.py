from backend.models import Event
from backend.crud import create_event, get_events
from fastapi import APIRouter, HTTPException, status
from backend.models import Volunteer, Organization
from backend.database import volunteers_collection, organizations_collection
from backend.main import get_password_hash
from passlib.context import CryptContext

router = APIRouter()

@router.post("/events/")
async def add_event(event: Event):
    return await create_event(event)

@router.get("/events/")
async def fetch_events():
    return await get_events()
