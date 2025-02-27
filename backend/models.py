from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List, Optional

class ContactPerson(BaseModel):
    name: str = Field(..., min_length=1)
    contact_number: str = Field(..., min_length=1)

class Event(BaseModel):
    event_id: int
    event_name: str = Field(..., min_length=1)
    organization: str = Field(..., min_length=1)
    description: str
    category: str = Field(..., min_length=1)
    date: datetime.date
    time: datetime.time
    venue: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1)
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    duration: str
    volunteer_requirements: Optional[str]
    skills_required: List[str]
    contact_email: EmailStr
    contact_person: ContactPerson
    image_url: Optional[str]
    registration_deadline: datetime.date
    additional_notes: Optional[str]
    status: str = Field(..., min_length=1)
    total_registered_volunteers: int
    created_at: datetime.datetime

class Volunteer(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    # Optionally, include a Google login field if you're handling OAuth
    google_account: Optional[str] = None  # For Google login

class Organization(BaseModel):
    logo_url: str
    name: str
    website_url: str
    organization_type: str = Field(..., pattern="^(Private Business|NGO|Educational Institutions|Other)$")
    about: str
    email: EmailStr
    contact_number: str
    address: str
    causes_supported: list[str]  # List of causes (can select multiple)