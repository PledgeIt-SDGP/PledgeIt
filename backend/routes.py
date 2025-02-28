from backend.models import Event
from backend.crud import create_event, get_events
from fastapi import APIRouter, HTTPException, status
from backend.models import Volunteer, Organization
from backend.database import volunteers_collection, organizations_collection
from backend.main import get_password_hash
from passlib.context import CryptContext

router = APIRouter()

# Initialize password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash a password
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Verify if the provided password matches the hash
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

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
