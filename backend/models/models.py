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
    description: str
    category: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM:SS
    venue: str
    city: str
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    duration: str
    volunteer_requirements: str
    skills_required: List[str]
    contact_email: str
    contact_person: dict
    image_url: str
    registration_deadline: str  # YYYY-MM-DD
    additional_notes: str
    status: str
    total_registered_volunteers: int
    created_at: str  # ISO format
    expireAt: str  # ISO format
