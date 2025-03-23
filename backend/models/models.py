from pydantic import BaseModel, EmailStr, Field
import datetime
from typing import List, Optional

class ContactPerson(BaseModel):
    name: str = Field(..., min_length=1)
    contact_number: str = Field(..., min_length=1)

class Event(BaseModel):
    event_id: int
    event_name: str
    organization: str
    organization_id: str  # Add this field
    description: str
    category: str
    date: str
    time: str
    venue: str
    city: str
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    duration: str
    volunteer_requirements: Optional[int]
    skills_required: List[str]
    contact_email: str
    contact_person: dict
    image_url: Optional[str]
    registration_deadline: str
    additional_notes: Optional[str]
    status: str
    total_registered_volunteers: int
    created_at: str
    expireAt: str
    volunteers: List[str] = []  # Add this field
