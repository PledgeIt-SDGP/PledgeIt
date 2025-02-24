from backend.database import events_collection
from backend.models import Event
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="volunteer_map")

async def geocode_location(event):
    location = geolocator.geocode(event.address)
    if location:
        event["latitude"] = location.latitude
        event["longitude"] = location.longitude
    else:
        event["latitude"] = 7.8731  # Default to Sri Lanka
        event["longitude"] = 80.7718
    return event

# Insert an event
async def create_event(event_data: Event):
    event_dict = event_data.dict()
    event_dict = await geocode_location(event_dict)
    await events_collection.insert_one(event_dict)
    return event_dict

# Fetch all events
async def get_events():
    events = await events_collection.find().to_list(100)
    return events
