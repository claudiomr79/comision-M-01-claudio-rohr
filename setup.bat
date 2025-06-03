@echo off
echo ================================
echo   TRAVEL PLATFORM SETUP
echo ================================

echo.
echo Installing Backend Dependencies...
cd Backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd "..\Frontend\Plataforma Interactiva de Viajes con Registro y Login"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo ================================
echo.
echo To run the application:
echo 1. Start Backend: cd Backend ^&^& npm run dev
echo 2. Start Frontend: cd "Frontend\Plataforma Interactiva de Viajes con Registro y Login" ^&^& npm run dev
echo.
pause
