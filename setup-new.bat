@echo off
echo ======================================
echo   TRAVEL PLATFORM - SETUP SCRIPT
echo ======================================
echo.

echo [1/5] Installing Backend Dependencies...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Frontend Dependencies...
cd "..\Frontend\Plataforma Interactiva de Viajes con Registro y Login"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/5] Checking MongoDB Connection...
cd ..\..\Backend
timeout /t 2 > nul

echo.
echo [4/5] Seeding Database with Sample Data...
call npm run seed
if %errorlevel% neq 0 (
    echo WARNING: Failed to seed database. You can run 'npm run seed' manually later.
)

echo.
echo [5/5] Setup Complete!
echo.
echo ======================================
echo          NEXT STEPS
echo ======================================
echo 1. Make sure MongoDB is running
echo 2. Run 'start.bat' to launch the application
echo 3. Backend will be available at: http://localhost:3002
echo 4. Frontend will be available at: http://localhost:5174
echo.
echo Press any key to exit...
pause > nul
