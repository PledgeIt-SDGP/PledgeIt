from fastapi import APIRouter
from typing import List
from database.database import events_collection

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
