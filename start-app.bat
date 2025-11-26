@echo off
echo ========================================
echo Starting Enterprise Architecture Assistant
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if server dependencies exist
if not exist server\node_modules (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
    echo.
)

echo Starting services...
echo.

REM Start the backend server in a new window
echo [1/2] Starting Backend Server on port 3001...
start "Backend Server - Port 3001" cmd /k "npm run server"

REM Wait a moment for the server to start
timeout /t 3 /nobreak > nul

REM Start the frontend dev server in a new window
echo [2/2] Starting Frontend Dev Server on port 5175...
start "Frontend - Port 5175" cmd /k "npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend: http://localhost:5175
echo Backend:  http://localhost:3001
echo.
echo Voice Chat is enabled and ready to use!
echo.
echo Press any key to open the app in your browser...
pause > nul

REM Open the app in the default browser
start http://localhost:5175

echo.
echo To stop the services, close the command windows.
echo.
pause