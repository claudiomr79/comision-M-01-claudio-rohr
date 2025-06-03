@echo off
echo ================================
echo   STARTING TRAVEL PLATFORM
echo ================================

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm run dev"

timeout /t 3

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd \"Frontend\Plataforma Interactiva de Viajes con Registro y Login\" && npm run dev"

echo ================================
echo   SERVERS STARTING...
echo ================================
echo Backend: http://localhost:3002
echo Frontend: http://localhost:5174
echo.
echo Both servers are starting in new windows...
echo Backend: API and MongoDB integration
echo Frontend: React app with authentication
echo.
echo Press any key to continue...
pause >nul
