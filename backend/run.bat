@echo off
echo =========================================
echo Setting up Campus Navigation API Server
echo =========================================

echo.
echo [1/3] Checking for Virtual Environment...
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

echo.
echo [2/3] Activating Virtual Environment and Installing Dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [3/3] Starting the Server...
echo The API will be available at: http://127.0.0.1:8000
echo The Documentation will be at: http://127.0.0.1:8000/docs
echo Press Ctrl+C to stop the server.
echo =========================================
echo.

uvicorn main:app --reload
