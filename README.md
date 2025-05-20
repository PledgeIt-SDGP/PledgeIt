# PledgeIt - Volunteer Management Platform

PledgeIt is a platform designed to streamline volunteer management for organizations, making it easier to organize events, manage volunteers, and communicate effectively.

## Getting Started

### 1. Backend Setup

Backend is already so no need to setup it, but if you realy want it follow these steps to set up the backend:

#### -Create a Virtual Environment

```sh
cd backend
python -m venv venv  # Create a virtual environment
source venv\Scripts\activate  # Activate it (Use 'venv/bin/activate' on Macs)
pip install -r requirements.txt  # Install dependencies
```

#### -Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```ini
# MongoDB Configuration
MONGO_URI=mongodb+srv://pledgeit_user_1:Haapuw3TFSmaO9Ts@pledgeit.purpn.mongodb.net/?retryWrites=true&w=majority&appName=pledgeit
DB_NAME=pledgeit_database
EVENTS_COLLECTION=events
VOLUNTEERS_COLLECTION=volunteers
ORGANIZATIONS_COLLECTION=organizations
REFRESH_TOKENS_COLLECTION=refresh_tokens

# Google OAuth Configuration
CLIENT_ID=384476861423-puie17g5sicqhldjatm2hh6b4qgspi5p.apps.googleusercontent.com
CLIENT_SECRET=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

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dwh8vc3ua
CLOUDINARY_API_KEY=478486378297543
CLOUDINARY_API_SECRET=DQgfCn_xqVCcIcwqlkKGumSHQfc

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=pledgeit6@gmail.com
EMAIL_PASSWORD=qqjh ivrd gkml nqce
EMAIL_FROM_NAME=PledgeIt Team
EMAIL_FROM_ADDRESS=pledgeit6@gmail.com

# Application Configuration
APP_NAME=PledgeIt
APP_URL=https://pledgeit.live
FRONTEND_URL=https://pledgeit.live
```

#### -Start the Backend

Run the following command to start the FastAPI backend:

```sh
uvicorn main:app --reload
```

### 2. Frontend Setup

Ffollow these steps to set up the backend:

#### -Install node modules

```sh
npm install
```

#### -Run the frontend

```sh
npm run dev
```

### Backend and Frontend links

- [PledgeIt BackEnd](https://pledgeit-backend-ihkh.onrender.com/)  
- [PledgeIt FrontEnd](https://pledgeit-frontend-production-production.up.railway.app/VolHome)
- [PledgeIt BackEnd documentation](https://pledgeit-backend-ihkh.onrender.com/docs)


