@echo off
echo ========================================
echo Starting Enterprise Architecture Assistant
echo ========================================
echo.

REM Check and install main dependencies
if not exist node_modules (
    echo Installing main dependencies...
    call npm install
    echo.
)

REM Install ws package for WebSocket support
echo Checking WebSocket dependencies...
call npm list ws >nul 2>&1
if errorlevel 1 (
    echo Installing WebSocket package...
    call npm install ws
    echo.
)

echo ========================================
echo Starting services...
echo ========================================
echo.

REM Start backend server with WebSocket support on port 3001
echo [1/2] Starting Backend Server with WebSocket support on port 3001...
start "Backend Server - Port 3001" cmd /k "node server.js"

REM Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

REM Start frontend dev server
echo [2/2] Starting Frontend Dev Server on port 5175...
start "Frontend - Port 5175" cmd /k "npm run dev"

echo.
echo ========================================
echo ✓ All services started successfully!
echo ========================================
echo.
echo Frontend:     http://localhost:5175
echo Backend API:  http://localhost:3001
echo.
echo WebSocket Endpoints:
echo   - General Stream: ws://localhost:3001/stream
echo   - Voice Chat:     ws://localhost:3001/realtime-proxy
echo.
echo Voice Chat with OpenAI Realtime API is ready!
echo.
echo Waiting for frontend to compile...
timeout /t 5 /nobreak > nul

REM Open in browser
echo Opening application in browser...
start http://localhost:5175

echo.
echo ========================================
echo IMPORTANT: Voice Chat Requirements
echo ========================================
echo 1. Use Chrome, Firefox, or Edge browser
echo 2. Allow microphone permissions when prompted
echo 3. Click the microphone icon in the bottom-right corner
echo 4. Speak naturally - the AI will respond with voice
echo.
echo Services Running:
echo   - Backend server with WebSocket support (port 3001)
echo   - Frontend Vite dev server (port 5175)
echo.
echo To stop all services, close both command windows.
echo.
pause