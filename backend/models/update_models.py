from pydantic import BaseModel, EmailStr
import datetime
from typing import List, Optional

class EventUpdate(BaseModel):
    event_name: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime.date] = None
    time: Optional[datetime.time] = None
    venue: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    duration: Optional[str] = None
    volunteer_requirements: Optional[str] = None
    skills_required: Optional[List[str]] = None
    contact_email: Optional[EmailStr] = None
    contact_person: Optional[dict] = None
    image_url: Optional[str] = None
    registration_deadline: Optional[datetime.date] = None
    additional_notes: Optional[str] = None
    status: Optional[str] = None
    total_registered_volunteers: Optional[int] = None
    created_at: Optional[datetime.datetime] = None
