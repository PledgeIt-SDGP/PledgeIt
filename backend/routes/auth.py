from fastapi import APIRouter, Request, HTTPException, UploadFile, File, Form, Depends, Response, status
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
import cloudinary
import cloudinary.uploader
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

# Load Cloudinary credentials
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

VALID_CAUSES = {"Environmental", "Community Service", "Education", "Healthcare", "Animal Welfare", "Disaster Relief", "Lifestyle & Culture", "Fundraising & Charity"}

# Refresh token storage (use DB in production)
refresh_tokens_store = {}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")

        if user_id is None or role is None:
            raise HTTPException(status_code=403, detail="Invalid credentials")

        user = volunteers_collection.find_one({"_id": ObjectId(user_id)}) or \
            organizations_collection.find_one({"_id": ObjectId(user_id)})

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {"user_id": str(user["_id"]), "role": role}
    except JWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

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

def get_user_by_email(email: str):
    return volunteers_collection.find_one({"email": email}) or organizations_collection.find_one({"email": email})

### 🔹 Pydantic Models
# In the OrganizationRegister class, add a field for event IDs
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
    created_events: list[str] = Field(default_factory=list)  # New field for event IDs

    @validator("causes_supported")
    def validate_causes(cls, values):
        if not values:
            raise ValueError("At least one cause must be selected.")
        if not set(values).issubset(VALID_CAUSES):
            raise ValueError("Invalid cause selected.")
        return values

# In the VolunteerRegister class, add a field for event IDs
class VolunteerRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    password_confirmation: str
    registered_events: list[str] = Field(default_factory=list)  # New field for event IDs

# Register Volunteer
@router.post('/auth/volunteer/register')
async def register_volunteer(volunteer: VolunteerRegister):
    verify_passwords(volunteer.password, volunteer.password_confirmation)

    existing_user = get_user_by_email(volunteer.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(volunteer.password)
    confirmation_token = secrets.token_urlsafe(32)

    volunteer_data = {
        "first_name": volunteer.first_name,
        "last_name": volunteer.last_name,
        "email": volunteer.email,
        "password": hashed_password,
        "is_verified": False,
        "confirmation_token": confirmation_token,
        "role": "volunteer"
    }

    result = volunteers_collection.insert_one(volunteer_data)

    # Generate access token
    access_token = create_access_token({"user_id": str(result.inserted_id), "role": "volunteer"})

    # Return user details and access token after registration
    return {
        "message": "Registration successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": f"{volunteer.first_name} {volunteer.last_name}",
            "email": volunteer.email,
            "role": "volunteer"
        }
    }

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
    password_confirmation: str = Form(...),
):
    # Validate file type
    if not allowed_file(logo.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, JPEG files are allowed.")

    verify_passwords(password, password_confirmation)

    # Check if email is already registered
    existing_user = get_user_by_email(email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(password)

    try:
        # Upload file to Cloudinary
        logo_bytes = await logo.read()
        cloudinary_upload = cloudinary.uploader.upload(logo_bytes, folder="organization_logos")
        logo_url = cloudinary_upload["secure_url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading logo: {str(e)}")

    result = organizations_collection.insert_one({
        "logo": logo_url,
        "name": name,
        "website_url": website_url,
        "organization_type": organization_type,
        "about": about,
        "email": email,
        "contact_number": contact_number,
        "address": address,
        "causes_supported": causes_supported,
        "password": hashed_password,
        "role": "organization"  # Added role
    })

    # Create access token
    access_token = create_access_token({"user_id": str(result.inserted_id), "role": "organization"})

    return {
        "message": "Organization registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": "organization",
            "logo": logo_url,
            "website_url": website_url,
            "about": about,
            "organization_type": organization_type,
            "causes_supported": causes_supported,
            "contact_number": contact_number,
            "address": address,
        }
    }

# Role-based access control (RBAC) utility
def role_required(required_role: str):
    def role_checker(user: dict = Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. This route requires {required_role} role."
            )
        return user
    return role_checker

# Login
@router.post('/auth/login')
async def login(email: str = Form(...), password: str = Form(...), response: Response = None):
    user = get_user_by_email(email)
    
    if not user or not user.get("password") or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"user_id": str(user["_id"]), "role": user["role"]})
    refresh_token = create_refresh_token()

    # Store refresh token in MongoDB
    db.refresh_tokens.update_one(
        {"user_id": str(user["_id"])},
        {"$set": {"refresh_token": refresh_token, "created_at": datetime.utcnow()}},
        upsert=True
    )

    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)

    # Return user details along with the token
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user.get("first_name") or user.get("name"),  # Volunteer has first_name, Organization has name
            "email": user.get("email"),
            "role": user.get("role")
        }
    }

# Refresh Token Route
@router.post('/auth/refresh_token')
async def refresh_token(refresh_token: str = Depends(oauth2_scheme)):
    user = db.refresh_tokens.find_one({"refresh_token": refresh_token})
    if not user:
        raise HTTPException(status_code=403, detail="Invalid refresh token")

    new_access_token = create_access_token({"user_id": user["user_id"], "role": user["role"]})
    return {"access_token": new_access_token, "token_type": "bearer"}

# Protect routes with role-based access control
@router.get('/VolDash')
async def volunteer_dashboard(user: dict = Depends(role_required("volunteer"))):
    return {"message": "Welcome to the volunteer dashboard!"}

@router.get('/OrgDash')
async def organization_dashboard(user: dict = Depends(role_required("organization"))):
    return {"message": "Welcome to the organization dashboard!"}

@router.post('/auth/logout')
async def logout(response: Response, user: dict = Depends(get_current_user)):
    # Optionally, you can invalidate the refresh token in the database
    db.refresh_tokens.delete_one({"user_id": user["user_id"]})
    
    # Clear the refresh token cookie
    response.delete_cookie(key="refresh_token")
    
    return {"message": "Logged out successfully"}

@router.delete('/auth/volunteer/delete')
async def delete_volunteer(user: dict = Depends(get_current_user)):
    # Ensure the user is a volunteer
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Permission denied. Only volunteers can delete their accounts.")

    # Delete the volunteer from the database
    result = volunteers_collection.delete_one({"_id": ObjectId(user["user_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    # Optionally, delete the refresh token
    db.refresh_tokens.delete_one({"user_id": user["user_id"]})

    return {"message": "Volunteer account deleted successfully"}

@router.delete('/auth/organization/delete')
async def delete_organization(user: dict = Depends(get_current_user)):
    # Ensure the user is an organization
    if user["role"] != "organization":
        raise HTTPException(status_code=403, detail="Permission denied. Only organizations can delete their accounts.")

    # Delete the organization from the database
    result = organizations_collection.delete_one({"_id": ObjectId(user["user_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Organization not found")

    # Optionally, delete the refresh token
    db.refresh_tokens.delete_one({"user_id": user["user_id"]})

    return {"message": "Organization account deleted successfully"}

@router.get('/auth/me')
async def get_current_user_details(user: dict = Depends(get_current_user)):
    if user["role"] == "volunteer":
        user_data = volunteers_collection.find_one({"_id": ObjectId(user["user_id"])})
    elif user["role"] == "organization":
        user_data = organizations_collection.find_one({"_id": ObjectId(user["user_id"])})
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return all fields for organizations
    if user["role"] == "organization":
        return {
            "id": str(user_data["_id"]),
            "name": user_data.get("name"),
            "email": user_data.get("email"),
            "role": user_data.get("role"),
            "logo": user_data.get("logo"),
            "website_url": user_data.get("website_url"),
            "about": user_data.get("about"),
            "organization_type": user_data.get("organization_type"),
            "causes_supported": user_data.get("causes_supported"),
            "contact_number": user_data.get("contact_number"),
            "address": user_data.get("address"),
        }
    else:
        # Return basic fields for volunteers
        return {
            "id": str(user_data["_id"]),
            "name": user_data.get("first_name") or user_data.get("name"),
            "email": user_data.get("email"),
            "role": user_data.get("role"),
        }
    
@router.get("/auth/total-users")
async def get_total_users():
    total_volunteers = volunteers_collection.count_documents({})
    total_organizations = organizations_collection.count_documents({})
    total_users = total_volunteers + total_organizations
    return {"total_users": total_users}

@router.put('/auth/volunteer/update')
async def update_volunteer_details(
    user: dict = Depends(get_current_user),
    first_name: str = Form(None),
    last_name: str = Form(None),
    password: str = Form(None),
    password_confirmation: str = Form(None),
):
    if user["role"] != "volunteer":
        raise HTTPException(status_code=403, detail="Permission denied. Only volunteers can update their details.")

    update_data = {}
    if first_name:
        update_data["first_name"] = first_name
    if last_name:
        update_data["last_name"] = last_name

    # Handle password update
    if password and password_confirmation:
        verify_passwords(password, password_confirmation)
        update_data["password"] = hash_password(password)
    elif password or password_confirmation:
        raise HTTPException(status_code=400, detail="Both password and password confirmation are required.")

    # Update the volunteer's details in the database
    result = volunteers_collection.update_one(
        {"_id": ObjectId(user["user_id"])},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes were made.")

    return {"message": "Volunteer details updated successfully"}

@router.put('/auth/organization/update')
async def update_organization_details(
    user: dict = Depends(get_current_user),
    name: str = Form(None),
    website_url: str = Form(None),
    organization_type: str = Form(None),
    about: str = Form(None),
    contact_number: str = Form(None),
    address: str = Form(None),
    causes_supported: list[str] = Form(None),
    password: str = Form(None),
    password_confirmation: str = Form(None),
    logo: UploadFile = File(None),
):
    if user["role"] != "organization":
        raise HTTPException(status_code=403, detail="Permission denied. Only organizations can update their details.")

    if password and password_confirmation:
        verify_passwords(password, password_confirmation)
        hashed_password = hash_password(password)
    else:
        hashed_password = None

    update_data = {}
    if name:
        update_data["name"] = name
    if website_url:
        update_data["website_url"] = website_url
    if organization_type:
        update_data["organization_type"] = organization_type
    if about:
        update_data["about"] = about
    if contact_number:
        update_data["contact_number"] = contact_number
    if address:
        update_data["address"] = address
    if causes_supported:
        update_data["causes_supported"] = causes_supported
    if logo:
        if not allowed_file(logo.filename):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, JPEG files are allowed.")
        logo_bytes = await logo.read()
        cloudinary_upload = cloudinary.uploader.upload(logo_bytes, folder="organization_logos")
        update_data["logo"] = cloudinary_upload["secure_url"]
    if hashed_password:
        update_data["password"] = hashed_password

    organizations_collection.update_one({"_id": ObjectId(user["user_id"])}, {"$set": update_data})

    return {"message": "Organization details updated successfully"}