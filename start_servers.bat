@echo off
echo =======================================================
echo    UPI Payment Communication Visualizer - Launch
echo =======================================================
echo.
echo 1. Starting FastAPI Backend (Port 8000)...
start "UPI Visualizer Backend" cmd /k "python run_backend.py"
timeout /t 2 /nobreak >nul

echo 2. Starting Vite React Frontend (Port 5173)...
start "UPI Visualizer Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application successfully launched!
echo Open your browser at: http://localhost:5173
echo =======================================================
