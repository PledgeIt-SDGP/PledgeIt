# PledgeIt
A platform for volunteers

## Setup Instructions

### FastAPI Backend

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/PledgeIt.git
    cd PledgeIt/backend
    ```

2. **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows
    source venv/bin/activate  # On macOS 
    ```

3. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the FastAPI server:**
    ```bash
    uvicorn main:app --reload
    ```

### Vite React Frontend

1. **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the development server:**
    ```bash
    npm run dev
    ```
