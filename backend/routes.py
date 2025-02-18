from fastapi import APIRouter, HTTPException
from backend.models import Event
from backend.crud import create_event, get_events

router = APIRouter()

@router.post("/events/")
async def add_event(event: Event):
    return await create_event(event)

@router.get("/events/")
async def fetch_events():
    return await get_events()
