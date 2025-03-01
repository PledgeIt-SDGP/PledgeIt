from fastapi import APIRouter, HTTPException, status
from backend.database import events_collection, volunteers_collection

router = APIRouter()

@router.post("/events/{event_id}/participate/")
async def participate_event(event_id: int, volunteer_email: str):
    """
    Endpoint for volunteers to participate in an event by scanning the QR code.
    """
    # Check if the event exists
    event = await events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    # Check if the volunteer is registered
    volunteer = await volunteers_collection.find_one({"email": volunteer_email})
    if not volunteer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer not found"
        )

    # Check if the volunteer has already participated
    if "participated_events" not in volunteer:
        volunteer["participated_events"] = []

    if event_id in volunteer["participated_events"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Volunteer has already participated in this event"
        )

    # Mark the volunteer as participated
    volunteer["participated_events"].append(event_id)
    await volunteers_collection.update_one(
        {"email": volunteer_email},
        {"$set": {"participated_events": volunteer["participated_events"]}}
    )

    # Increment the total number of participants in the event
    await events_collection.update_one(
        {"event_id": event_id},
        {"$inc": {"total_registered_volunteers": 1}}
    )

    return {"message": "Volunteer participation recorded successfully"}