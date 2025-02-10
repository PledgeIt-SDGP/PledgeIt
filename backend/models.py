from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Event(BaseModel):
    event_id: int
    event_name: str
    description: str
    category: str
    date: str
    time: str
    venue: str
    city: str
    address: str
    duration: str
    volunteer_requirements: str
    skills_required: List[str]
    contact_email: str
    contact_personal: str
    contact_number: str
    image_url: str
    registration_deadline: str
    additional_notes: Optional[str]
    status: str
    total_registered_volunteers: int
    created_at: datetime
    latitude: float
    longitude: float
