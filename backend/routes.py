from backend.models import Event, Volunteer, Organization
from backend.crud import create_event, get_events
from backend.database import volunteers_collection, organizations_collection, events_collection
from backend.main import get_password_hash
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from geopy.geocoders import Nominatim
import qrcode
from io import BytesIO
import base64
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter()

#Funtion to generate QR Code
async def generate_qr_code(event_id: int):
    event_url = f"https://pledgeit.com/events/{event_id}/participate"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(event_url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return buffered.getvalue()

# Function to send email with QR code
async def send_email_with_qr_code(organization_email: str, event_name: str, qr_code_bytes: bytes):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = organization_email
    msg['Subject'] = f"QR Code for Event: {event_name}"
    
    body = f"Please find the QR code for your event '{event_name}' attached."
    msg.attach(MIMEText(body, 'plain'))
    
    qr_code_image = MIMEImage(qr_code_bytes, name="event_qr_code.png")
    msg.attach(qr_code_image)
    
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, organization_email, msg.as_string())
        print("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/register/volunteer/")
async def register_volunteer(volunteer: Volunteer):
    # Check if the email is already registered in the volunteers collection
    existing_user = volunteers_collection.find_one({"email": volunteer.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Ensure password matches confirm_password
    if volunteer.password != volunteer.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    # Hash the password
    hashed_password = get_password_hash(volunteer.password)

    # Save volunteer to the database
    volunteer_data = volunteer.dict()
    volunteer_data["hashed_password"] = hashed_password
    del volunteer_data["confirm_password"]  # Don't store confirm password in DB

    volunteers_collection.insert_one(volunteer_data)

    return {"msg": "Volunteer registered successfully"}


@router.post("/register/organization/")
async def register_organization(organization: Organization):
    # Check if the organization email already exists in the organizations collection
    existing_org = organizations_collection.find_one({"email": organization.email})
    if existing_org:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Save organization to the database
    org_data = organization.dict()
    organizations_collection.insert_one(org_data)

    return {"msg": "Organization registered successfully"}


@router.post("/events/")
async def add_event(event: Event):
    event_dict = event.dict()

    # Generate a QR code for the event
    qr_code_bytes = await generate_qr_code(event_dict["event_id"])
    qr_code_base64 = base64.b64encode(qr_code_bytes).decode()
    event_dict["qr_code_url"] = f"data:image/png;base64,{qr_code_base64}"
    
    # Insert the event into the database
    event_dict["created_at"] = datetime.now()
    await events_collection.insert_one(event_dict)
    
    # Send the QR code to the organization's email
    organization_email = event_dict["contact_email"]
    event_name = event_dict["event_name"]
    await send_email_with_qr_code(organization_email, event_name, qr_code_bytes)
    
    return {"message": "Event created successfully", "event": event_dict}
