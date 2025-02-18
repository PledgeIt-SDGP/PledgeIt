import asyncio
from backend.database import events_collection
from datetime import datetime

dummy_events = [
    {
        "event_id": 1,
        "event_name": "Beach Cleanup Drive",
        "description": "Join us for a beach cleanup to keep Galle's beaches clean.",
        "category": "Environmental",
        "date": "2025-03-15",
        "time": "08:30 AM",
        "venue": "Galle Fort Beach",
        "city": "Galle",
        "address": "Galle Fort Beach, near Lighthouse",
        "duration": "3 hours",
        "volunteer_requirements": "50 volunteers needed",
        "skills_required": ["Teamwork", "Waste Segregation"],
        "contact_email": "contact@greenlanka.org",
        "contact_personal": "John Doe",
        "contact_number": "+94 77 123 4567",
        "image_url": "https://example.com/galle-cleanup.jpg",
        "registration_deadline": "2025-03-10",
        "additional_notes": "Bring your own reusable water bottle and gloves",
        "status": "Open",
        "total_registered_volunteers": 20,
        "created_at": datetime.utcnow(),
        "latitude": 6.0266,
        "longitude": 80.217
    },
    {
        "event_id": 2,
        "event_name": "Tree Planting Campaign",
        "description": "A tree planting campaign in Kandy to promote urban greenery.",
        "category": "Environmental",
        "date": "2025-04-05",
        "time": "09:00 AM",
        "venue": "Peradeniya Botanical Gardens",
        "city": "Kandy",
        "address": "Peradeniya Road, Kandy",
        "duration": "5 hours",
        "volunteer_requirements": "100 volunteers needed",
        "skills_required": ["Gardening", "Tree Planting"],
        "contact_email": "info@ecogreensl.com",
        "contact_personal": "Jane Smith",
        "contact_number": "+94 71 987 6543",
        "image_url": "https://example.com/kandy-treeplanting.jpg",
        "registration_deadline": "2025-03-30",
        "additional_notes": "Wear comfortable clothing and a hat",
        "status": "Open",
        "total_registered_volunteers": 30,
        "created_at": datetime.utcnow(),
        "latitude": 7.2734,
        "longitude": 80.6007
    }
]

async def seed_database():
    await events_collection.insert_many(dummy_events)
    print("✅ Dummy data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
