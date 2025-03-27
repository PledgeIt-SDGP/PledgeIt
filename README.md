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
MONGO_URI=<your-mongodb-uri>
DB_NAME=pledgeit_database
COLLECTION_NAME=events
VOLUNTEERS_COLLECTION=volunteers
ORGANIZATIONS_COLLECTION=organizations

# Google OAuth Credentials
CLIENT_ID=<your-google-client-id>
CLIENT_SECRET=<your-google-client-secret>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# SMTP settings for email sending using Mailtrap
SMTP_SERVER=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USERNAME=<your-smtp-username>
SMTP_PASSWORD=<your-smtp-password>
FROM_EMAIL=no-reply@yourdomain.com
```

Start the FastAPI backend:
```sh
uvicorn main:app --reload
```

