from pydantic import BaseModel, Field
from typing import Optional, List

class ContactPerson(BaseModel):
    name: str
    contact_number: str

class Event(BaseModel):
    event_id: str
    event_name: str
    organization: str
    description: str
    category: str
    date: str
    time: str
    venue: str
    city: str
    address: str
    latitude: Optional[float] = None  # New field
    longitude: Optional[float] = None  # New field
    duration: str
    volunteer_requirements: str
    skills_required: List[str]
    contact_email: str
    contact_person: ContactPerson
    image_url: str
    registration_deadline: str
    additional_notes: Optional[str] = None
    status: str
    total_registered_volunteers: int
    created_at: str
