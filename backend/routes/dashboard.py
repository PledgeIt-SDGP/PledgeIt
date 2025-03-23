from fastapi import APIRouter
from typing import List
from database.database import events_collection
from models.models import Event
from routes.events import event_serializer
from datetime import datetime

router = APIRouter()

@router.get("/dashboard/causes", response_model=List[dict])
async def get_dashboard_causes():
    """
    Aggregates events data by category for the dashboard CausesChart.
    Returns a list of objects with 'name' (the cause/category) and 'value' (count).
    """
    pipeline = [
        {"$group": {"_id": "$category", "value": {"$sum": 1}}},
        {"$project": {"name": "$_id", "value": 1, "_id": 0}}
    ]
    causes_data = list(events_collection.aggregate(pipeline))
    return causes_data

@router.get("/dashboard/upcoming", response_model=List[Event])
async def get_dashboard_upcoming_events():
    """
    Returns upcoming events with a date greater than or equal to today's date.
    The date field is expected in 'YYYY-MM-DD' format.
    """
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    events = list(events_collection.find({
        "date": {"$gte": today_str},
        "event_id": {"$type": "int"}
    }))
    return [Event(**event_serializer(event)) for event in events]
