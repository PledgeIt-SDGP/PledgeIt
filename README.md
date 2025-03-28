# PledgeIt - Volunteer Management Platform

### 1. Set Up the Backend
```sh
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate it (Use 'venv\Scripts\activate' on Windows)
pip install -r requirements.txt  # Install dependencies
```

Create a `.env` file in the `backend` directory with the following variables:
```ini
# MongoDB configuration
MONGO_URI=mongodb+srv://pledgeit_user_1:Haapuw3TFSmaO9Ts@pledgeit.purpn.mongodb.net/?retryWrites=true&w=majority
DB_NAME=pledgeit_database
COLLECTION_NAME=events
VOLUNTEERS_COLLECTION=volunteers
ORGANIZATIONS_COLLECTION=organizations

CLIENT_ID=384476861423-puie17g5sicqhldjatm2hh6b4qgspi5p.apps.googleusercontent.com
CLIENT_SECRET=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

CLOUDINARY_CLOUD_NAME=dwh8vc3ua
CLOUDINARY_API_KEY=478486378297543
CLOUDINARY_API_SECRET=DQgfCn_xqVCcIcwqlkKGumSHQfc

# SMTP settings for email sending using Mailtrap
SMTP_SERVER=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USERNAME=5f3cba7bb7eae0
SMTP_PASSWORD=303bd3798e0b63
FROM_EMAIL=no-reply@yourdomain.com
```

Start the FastAPI backend:
```sh
uvicorn main:app --reload
```

