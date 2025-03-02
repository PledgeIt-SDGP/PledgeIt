from fastapi import APIRouter, Request, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field, validator
from passlib.context import CryptContext
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
import httpx
from uuid import uuid4
import shutil
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create a router for authentication routes
router = APIRouter()

# Initialize password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

# MongoDB Client Setup
client = MongoClient(os.getenv('MONGO_URI'))
db = client[os.getenv('DB_NAME')]
volunteers_collection = db[os.getenv('VOLUNTEERS_COLLECTION')]
organizations_collection = db[os.getenv('ORGANIZATIONS_COLLECTION')]

ORG_LOGO_UPLOAD_DIR = "organization_logos"
os.makedirs(ORG_LOGO_UPLOAD_DIR, exist_ok=True)

# Valid causes for organizations
VALID_CAUSES = {"Environmental", "Community Service", "Education", "Healthcare",
                "Animal Welfare", "Disaster Relief", "Lifestyle & Culture", "Fundraising & Charity"}

# Pydantic model for volunteer registration
class VolunteerRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    password_confirmation: str

# Pydantic model for organization registration
class OrganizationRegister(BaseModel):
    name: str
    website_url: str
    organization_type: str = Field(..., pattern="^(Private Business|NGO|Educational Institution|Other)$")
    about: str
    email: str
    contact_number: str
    address: str
    causes_supported: list[str] = Field(..., min_items=1, max_items=8)
    password: str
    password_confirmation: str

    @validator("causes_supported")
    def validate_causes(cls, values):
        if not set(values).issubset(VALID_CAUSES):
            raise ValueError("Invalid cause selected.")
        return values

# Function to hash passwords
def hash_password(password: str):
    return pwd_context.hash(password)

# Function to verify if password and confirmation match
def verify_passwords(password: str, password_confirmation: str):
    if password != password_confirmation:
        raise HTTPException(status_code=400, detail="Passwords do not match")

# Register Google OAuth
oauth = OAuth()
oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    client_kwargs={"scope": "email profile"},
    redirect_uri='http://127.0.0.1:8000/auth/callback'  # Ensure correct in Google Developer Console
)

# Google OAuth login route
@router.get('/auth/google')
async def login_via_google(request: Request):
    redirect_uri = 'http://127.0.0.1:8000/auth/callback'
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google OAuth callback route
@router.get('/auth/callback')
async def auth_callback(request: Request):
    try:
        google_token = await oauth.google.authorize_access_token(request)
        if "access_token" not in google_token:
            raise HTTPException(status_code=400, detail="Google authentication failed")

        async with httpx.AsyncClient() as client:
            user_info = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {google_token['access_token']}"}
            )
        user = user_info.json()
        logging.info(f"🔹 User Info: {user}")

        existing_user = volunteers_collection.find_one({"email": user.get('email')})
        existing_org = organizations_collection.find_one({"email": user.get('email')})
        if existing_user or existing_org:
            return {"message": "User already exists", "id": str(existing_user['_id'] if existing_user else existing_org['_id'])}

        volunteer_data = {
            "first_name": user.get("given_name"),
            "last_name": user.get("family_name"),
            "email": user.get("email"),
            "password": None,
            "profile_image": user.get("picture")
        }
        result = volunteers_collection.insert_one(volunteer_data)
        return {"message": "Volunteer registered successfully via Google", "volunteer_id": str(result.inserted_id)}
    except Exception as e:
        logging.error(f"🔹 Unexpected Error: {e}")
        return {"error": "Unexpected error", "message": str(e)}

# Volunteer Registration route
@router.post('/auth/volunteer/register')
async def register_volunteer(volunteer: VolunteerRegister):
    verify_passwords(volunteer.password, volunteer.password_confirmation)
    if volunteers_collection.find_one({"email": volunteer.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(volunteer.password)
    result = volunteers_collection.insert_one({
        "first_name": volunteer.first_name,
        "last_name": volunteer.last_name,
        "email": volunteer.email,
        "password": hashed_password
    })
    return {"message": "Volunteer registered successfully", "volunteer_id": str(result.inserted_id)}

# Organization Registration route
@router.post('/auth/organization/register')
async def register_organization(
    logo: UploadFile = File(...),
    name: str = Form(...),
    website_url: str = Form(...),
    organization_type: str = Form(...),
    about: str = Form(...),
    email: str = Form(...),
    contact_number: str = Form(...),
    address: str = Form(...),
    causes_supported: list[str] = Form(...),
    password: str = Form(...),
    password_confirmation: str = Form(...)
):
    verify_passwords(password, password_confirmation)
    if organizations_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(password)
    file_extension = logo.filename.split(".")[-1]
    unique_filename = f"{uuid4()}.{file_extension}"
    file_path = os.path.join(ORG_LOGO_UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(logo.file, buffer)
    result = organizations_collection.insert_one({
        "logo": f"/organization_logos/{unique_filename}",
        "name": name,
        "website_url": website_url,
        "organization_type": organization_type,
        "about": about,
        "email": email,
        "contact_number": contact_number,
        "address": address,
        "causes_supported": causes_supported,
        "password": hashed_password
    })
    return {"message": "Organization registered successfully", "organization_id": str(result.inserted_id), "logo_url": f"/organization_logos/{unique_filename}"}
