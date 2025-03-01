from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
import httpx

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

# Pydantic model for volunteer registration
class VolunteerRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    password_confirmation: str

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
    redirect_uri='http://127.0.0.1:8000/auth/callback'  # Make sure this URI is correct in Google Developer Console
)

# Google OAuth login route
@router.get('/auth/google')
async def login_via_google(request: Request):
    redirect_uri = 'http://127.0.0.1:8000/auth/callback'  # Ensure this matches your Google console
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google OAuth callback route
@router.get('/auth/callback')
async def auth_callback(request: Request):
    try:
        # Get Google token
        google_token = await oauth.google.authorize_access_token(request)
        print("🔹 Google Token Response:", google_token)

        # Fetch user info from Google using the access token
        async with httpx.AsyncClient() as client:
            user_info = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",  # Correct user info endpoint
                headers={"Authorization": f"Bearer {google_token['access_token']}"}
            )

        user = user_info.json()
        print("🔹 User Info:", user)  # Debugging user info
        return {"user_info": user}

    except HTTPException as e:
        print(f"🔹 Error: {e.detail}")
        return {"error": "Authentication failed", "message": str(e)}
    except Exception as e:
        print(f"🔹 Unexpected Error: {e}")
        return {"error": "Unexpected error", "message": str(e)}

# Volunteer Registration route
@router.post('/auth/volunteer/register')
async def register_volunteer(volunteer: VolunteerRegister):
    # Verify passwords
    verify_passwords(volunteer.password, volunteer.password_confirmation)
    
    # Check if the email already exists
    existing_user = volunteers_collection.find_one({"email": volunteer.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password before saving
    hashed_password = hash_password(volunteer.password)
    
    # Create the volunteer data
    volunteer_data = {
        "first_name": volunteer.first_name,
        "last_name": volunteer.last_name,
        "email": volunteer.email,
        "password": hashed_password
    }

    # Insert volunteer data into MongoDB
    result = volunteers_collection.insert_one(volunteer_data)

    # Return success response
    return {"message": "Volunteer registered successfully", "volunteer_id": str(result.inserted_id)}
