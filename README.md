# PledgeIt - Volunteer Management Platform

## Getting Started

Follow these steps to set up and start the application on your local machine.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (LTS version) - [Download here](https://nodejs.org/)
- **Python 3.9+** - [Download here](https://www.python.org/)
- **MongoDB** (local or cloud instance) - [Setup guide](https://www.mongodb.com/docs/manual/installation/)

---

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/pledgeit.git
cd pledgeit
```

### 2. Set Up the Backend
```sh
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate it (Use 'venv\Scripts\activate' on Windows)
pip install -r requirements.txt  # Install dependencies
```

Create a `.env` file in the `backend` directory with the following variables:
```ini
MONGO_URI=<your-mongodb-uri>
SECRET_KEY=<your-secret-key>
MAILGUN_API_KEY=<your-mailgun-api-key>
MAILGUN_DOMAIN=<your-mailgun-domain>
```

Start the FastAPI backend:
```sh
uvicorn main:app --reload
```

The backend should now be running at `http://127.0.0.1:8000`

---

### 3. Set Up the Frontend
```sh
cd ../frontend
npm install  # Install dependencies
```

Create a `.env` file in the `frontend` directory with the backend URL:
```ini
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the React frontend:
```sh
npm run dev
```

The frontend should now be running at `http://localhost:5173`

---

## Running the Application

Once both the backend and frontend are running:
- Open `http://localhost:5173` in your browser.
- Sign up or log in to start using the platform.

---

## Troubleshooting

- **Backend errors?** Ensure MongoDB is running and the `.env` file is correctly configured.
- **Frontend not loading?** Check the API URL in `.env` and restart the frontend.
- **CORS issues?** Ensure the backend allows requests from `http://localhost:5173`.

---

## Contributing

Feel free to fork the repository, create a branch, and submit a pull request.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

Happy coding! 🚀

