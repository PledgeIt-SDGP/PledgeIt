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
    event_url = f"https://pledgeit.com/events/{event_id}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=2,
    )
    qr.add_data(event_url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return buffered.getvalue()

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
    return await create_event(event)

@router.get("/events/")
async def fetch_events():
    return await get_events()
