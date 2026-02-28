# Campus Navigation App

This is a full-stack web application designed to help students and visitors navigate a college campus. It provides an interactive map, facility search, and step-by-step route navigation between buildings, classrooms, and labs.

## Tech Stack

*   **Frontend**: React, Vite, TailwindCSS, React-Leaflet
*   **Backend**: Python, FastAPI, Uvicorn
*   **Map Tiles**: CartoDB Positron

## Features

*   **Interactive Campus Map**: Built with React-Leaflet, utilizing premium CartoDB tiles and custom color-coded markers for different facility types (e.g., Yellow for Classrooms, Green for Labs).
*   **Facility Search**: A robust search bar to quickly locate specific buildings, classrooms, or offices across campus.
*   **Navigation & Routing**: Select a starting point and destination to receive a mapped out visual route (Polyline) along with estimated walking distances and time.
*   **Responsive UI**: A modern, glassmorphism-inspired sidebar that fully supports mobile and desktop viewing.

## Getting Started

### Prerequisites

*   **Python 3.8+**
*   **Node.js (v18+)** and **npm**

### 1. Running the Backend (FastAPI)

To start the backend, you can use the provided Windows batch script:

1.  Navigate into the `backend` folder.
2.  Double click the `run.bat` file.
    *   *This script will automatically create a Python virtual environment (`venv`), install the necessary dependencies from `requirements.txt`, and start the Uvicorn server on `http://127.0.0.1:8000`.*

Alternatively, to run manually:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Running the Frontend (React/Vite)

In a separate terminal window:

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the Node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---
*Created as part of a Hackathon project.*
