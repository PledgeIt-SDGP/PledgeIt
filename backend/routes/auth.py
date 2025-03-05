from fastapi import APIRouter, Request, HTTPException, UploadFile, File, Form, Depends, Response
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
import secrets
from jose import jwt, JWTError
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create router
router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

# MongoDB setup
client = MongoClient(os.getenv('MONGO_URI'))
db = client[os.getenv('DB_NAME')]
volunteers_collection = db[os.getenv('VOLUNTEERS_COLLECTION')]
organizations_collection = db[os.getenv('ORGANIZATIONS_COLLECTION')]

# JWT Config
JWT_SECRET = os.getenv("JWT_SECRET", "your_secret_key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

ORG_LOGO_UPLOAD_DIR = "organization_logos"
os.makedirs(ORG_LOGO_UPLOAD_DIR, exist_ok=True)

VALID_CAUSES = {"Environmental", "Community Service", "Education", "Healthcare", "Animal Welfare", "Disaster Relief", "Lifestyle & Culture", "Fundraising & Charity"}

# Refresh token storage (use DB in production)
refresh_tokens_store = {}

### 🔹 Utility Functions
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_passwords(password: str, password_confirmation: str):
    if password != password_confirmation:
        raise HTTPException(status_code=400, detail="Passwords do not match")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token():
    return secrets.token_hex(32)

### 🔹 Pydantic Models
class VolunteerRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    password_confirmation: str

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

# Google OAuth
oauth = OAuth()
oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    client_kwargs={"scope": "email profile"},
    redirect_uri='http://127.0.0.1:8000/auth/callback'
)

### 🔹 Authentication Routes

# Register Volunteer
@router.post('/auth/volunteer/register')
async def register_volunteer(volunteer: VolunteerRegister):

    verify_passwords(volunteer.password, volunteer.password_confirmation)

    # Check if the email is already registered in either collection
    existing_user = volunteers_collection.find_one({"email": volunteer.email}) or organizations_collection.find_one({"email": volunteer.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(volunteer.password)

    result = volunteers_collection.insert_one({
        "first_name": volunteer.first_name,
        "last_name": volunteer.last_name,
        "email": volunteer.email,
        "password": hashed_password
    })
    return {"message": "Volunteer registered successfully", "volunteer_id": str(result.inserted_id)}

# File upload validation (only allow image files)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename: str):
    return "." in filename and filename.rsplit(".", 1)[-1].lower() in ALLOWED_EXTENSIONS

# Register Organization
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
    # Validate file type
    if not allowed_file(logo.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, JPEG files are allowed.")

    verify_passwords(password, password_confirmation)

    # Check if the email is already registered in either collection
    existing_user = volunteers_collection.find_one({"email": email}) or organizations_collection.find_one({"email": email})
    if existing_user:
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
    return {"message": "Organization registered successfully", "organization_id": str(result.inserted_id)}

# Login
@router.post('/auth/login')
async def login(email: str = Form(...), password: str = Form(...), response: Response = None):
    
    # Optimized search using $or to find user in either collection
    user = volunteers_collection.find_one({"email": email}) or organizations_collection.find_one({"email": email})
    
    if not user or not user.get("password") or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Determine the role
    role = "volunteer" if user in volunteers_collection.find() else "organization"

    # Create access token with role information
    access_token = create_access_token({"user_id": str(user["_id"]), "role": role})
    refresh_token = create_refresh_token()

    # Store the refresh token in memory for now
    refresh_tokens_store[str(user["_id"])] = refresh_token

    # Set refresh token in cookies
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="Lax")

    return {"access_token": access_token, "token_type": "bearer", "role": role}

# Google OAuth Login
@router.get('/auth/google')
async def login_via_google(request: Request):
    redirect_uri = 'http://127.0.0.1:8000/auth/callback'
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google OAuth Callback
@router.get('/auth/callback')
async def auth_callback(request: Request):
    google_token = await oauth.google.authorize_access_token(request)
    user_info = await httpx.AsyncClient().get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {google_token['access_token']}"}
    )
    user = user_info.json()
    existing_user = volunteers_collection.find_one({"email": user.get('email')}) or organizations_collection.find_one({"email": user.get('email')})

    if existing_user:
        return {"message": "User already exists", "id": str(existing_user['_id'])}

    result = volunteers_collection.insert_one({
        "first_name": user.get("given_name"),
        "last_name": user.get("family_name"),
        "email": user.get("email"),
        "password": None,
        "profile_image": user.get("picture")
    })
    return {"message": "Volunteer registered via Google", "volunteer_id": str(result.inserted_id)}

# Refresh token route
@router.post('/auth/refresh')
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    user = next((user_id for user_id, token in refresh_tokens_store.items() if token == refresh_token), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    new_access_token = create_access_token({"user_id": user})
    return {"access_token": new_access_token, "token_type": "bearer"}

# Logout route
@router.post('/auth/logout')
async def logout(response: Response, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        refresh_tokens_store.pop(refresh_token, None)  # Remove refresh token
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}