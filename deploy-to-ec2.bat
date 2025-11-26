@echo off
echo ===================================
echo Deploy to EC2 Instance
echo ===================================
echo.
echo This script will help you deploy to your EC2 instance.
echo Make sure you have:
echo 1. EC2 instance running
echo 2. SSH key file (.pem)
echo 3. Security group with ports 22, 80, 443, 3001, 5175 open
echo.

set /p EC2_IP="Enter your EC2 public IP or domain: "
set /p KEY_PATH="Enter path to your .pem file: "
set /p EC2_USER="Enter EC2 username (default: ubuntu): "
if "%EC2_USER%"=="" set EC2_USER=ubuntu

echo.
echo Deploying to %EC2_USER%@%EC2_IP%...
echo.

REM Create deployment package
echo Creating deployment package...
tar -czf deploy.tar.gz ^
    package.json ^
    package-lock.json ^
    server.js ^
    vite.config.ts ^
    tsconfig.json ^
    tsconfig.app.json ^
    tsconfig.node.json ^
    postcss.config.js ^
    tailwind.config.js ^
    eslint.config.js ^
    index.html ^
    .env ^
    src ^
    public ^
    nginx-enterprise.conf ^
    deploy-to-ec2.sh

echo.
echo Uploading files to EC2...
scp -i "%KEY_PATH%" deploy.tar.gz %EC2_USER%@%EC2_IP%:~/

echo.
echo Connecting to EC2 and running deployment...
ssh -i "%KEY_PATH%" %EC2_USER%@%EC2_IP% "mkdir -p ~/enterprise-app && cd ~/enterprise-app && tar -xzf ~/deploy.tar.gz && chmod +x deploy-to-ec2.sh && ./deploy-to-ec2.sh"

echo.
echo Cleaning up...
del deploy.tar.gz

echo.
echo ===================================
echo Deployment Complete!
echo ===================================
echo.
echo Your app should now be running on:
echo - https://enterprise.sae-g.com (if DNS is configured)
echo - http://%EC2_IP% (direct IP access)
echo.
echo To check status on EC2:
echo ssh -i "%KEY_PATH%" %EC2_USER%@%EC2_IP% "pm2 status"
echo.
pause