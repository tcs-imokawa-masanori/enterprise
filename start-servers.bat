@echo off
echo Starting Enterprise Architecture Application...
echo.
echo [1/2] Starting Backend Server (Port 3001)...
start cmd /k "npm run server"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server (Port 5175)...
start cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo =========================================
echo Servers are starting...
echo =========================================
echo Frontend: http://localhost:5175
echo Backend:  http://localhost:3001
echo Voice API: http://localhost:3001/realtime/client_secret
echo =========================================
echo.
echo Press any key to open the application in your browser...
pause > nul
start http://localhost:5175