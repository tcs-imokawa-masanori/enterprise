@echo off
REM Azure Deployment Script for Enterprise Architecture App (Windows)
REM This script deploys the application to Azure server

setlocal enabledelayedexpansion

set AZURE_HOST=20.222.180.9
set AZURE_USER=azureuser
set PEM_KEY=C:\Users\Imokawa\Documents\pem\llm.pem
set REMOTE_DIR=/home/azureuser/projects/enterprise

echo ==========================================
echo Enterprise App - Azure Deployment
echo ==========================================
echo Target: %AZURE_HOST%
echo Domain: enterprise.sae-g.com
echo ==========================================
echo.

REM Step 1: Build frontend
echo [1/5] Building frontend locally...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

REM Step 2: Create remote directory
echo.
echo [2/5] Creating remote directory on Azure...
ssh -i "%PEM_KEY%" %AZURE_USER%@%AZURE_HOST% "mkdir -p %REMOTE_DIR%/dist %REMOTE_DIR%/server"

REM Step 3: Upload built files
echo.
echo [3/5] Uploading frontend build...
scp -i "%PEM_KEY%" -r dist\* %AZURE_USER%@%AZURE_HOST%:%REMOTE_DIR%/dist/
if errorlevel 1 (
    echo ERROR: Failed to upload frontend files
    pause
    exit /b 1
)

echo.
echo [4/5] Uploading backend files...
scp -i "%PEM_KEY%" -r server\* %AZURE_USER%@%AZURE_HOST%:%REMOTE_DIR%/server/
scp -i "%PEM_KEY%" server.js package.json package-lock.json %AZURE_USER%@%AZURE_HOST%:%REMOTE_DIR%/
if errorlevel 1 (
    echo ERROR: Failed to upload backend files
    pause
    exit /b 1
)

echo.
echo [5/5] Setting up application on Azure server...
echo This will take a few moments...
echo.

ssh -i "%PEM_KEY%" %AZURE_USER%@%AZURE_HOST% "bash -s" < deploy-azure-setup.sh

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Application should be accessible at:
echo   http://enterprise.sae-g.com
echo   http://%AZURE_HOST%:5180 (if DNS not configured)
echo.
echo Backend API:
echo   http://enterprise.sae-g.com/api
echo   http://%AZURE_HOST%:3005/health
echo.
echo Next Steps:
echo 1. Configure DNS for enterprise.sae-g.com
echo 2. Add OpenAI API key to server/.env
echo 3. Setup SSL certificate with certbot
echo.
echo To view logs:
echo   ssh -i "%PEM_KEY%" %AZURE_USER%@%AZURE_HOST%
echo   ~/.nvm/versions/node/*/bin/pm2 logs enterprise-backend
echo.
pause

