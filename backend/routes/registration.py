from fastapi import APIRouter, HTTPException, status, Form
from backend.database import events_collection, volunteers_collection
from backend.utils import generate_qr_code, send_email_with_qr_code
import logging

router = APIRouter()

@router.post('/events/{event_id}/register')
async def register_for_event(event_id: int, volunteer_email: str = Form(...)):
    """
    Register a volunteer for an event and send them a QR code via email.
    """
    # Check if the event exists
    event = await events_collection.find_one({"event_id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    # Check if the volunteer exists
    volunteer = await volunteers_collection.find_one({"email": volunteer_email})
    if not volunteer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer not found"
        )

    # Check if the volunteer is already registered for the event
    if "registered_events" not in volunteer:
        volunteer["registered_events"] = []

    if event_id in volunteer["registered_events"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Volunteer is already registered for this event"
        )

    # Register the volunteer for the event
    volunteer["registered_events"].append(event_id)
    await volunteers_collection.update_one(
        {"email": volunteer_email},
        {"$set": {"registered_events": volunteer["registered_events"]}}
    )

    # Increment the total number of registered volunteers in the event
    await events_collection.update_one(
        {"event_id": event_id},
        {"$inc": {"total_registered_volunteers": 1}}
    )

    # Generate the QR code for the event
    try:
        qr_code_bytes = await generate_qr_code(event_id)
        qr_code_base64 = base64.b64encode(qr_code_bytes).decode()
        qr_code_url = f"data:image/png;base64,{qr_code_base64}"
    except Exception as e:
        logging.error(f"Failed to generate QR code: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate QR code"
        )

    # Send the QR code to the volunteer's email
    try:
        await send_email_with_qr_code(
            recipient_email=volunteer_email,
            event_name=event["event_name"],
            qr_code_bytes=qr_code_bytes
        )
    except Exception as e:
        logging.error(f"Failed to send QR code email to volunteer: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send QR code email"
        )

    return {
        "message": "Registration successful",
        "event_id": event_id,
        "qr_code_url": qr_code_url
    }