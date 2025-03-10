@router.post('/events/{event_id}/register')
async def register_for_event(event_id: int, volunteer_email: str = Form(...)):
    # Your logic to register the volunteer for the event
    # (e.g., updating the event's registered volunteers list)
    
    # Registration successful—now send the QR code email to the volunteer
    try:
        from qr_email_handler import send_event_qr_to_volunteer
        send_event_qr_to_volunteer(event_id, volunteer_email)
    except Exception as e:
        logging.error(f"Failed to send QR code email to volunteer: {e}")
    
    return {"message": "Registration successful", "event_id": event_id}