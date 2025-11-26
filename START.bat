@echo off
title Enterprise Architecture Assistant - Quick Start

echo Starting Enterprise Architecture Assistant...
echo.

if not exist node_modules call npm install
if not exist server\node_modules (
    cd server
    call npm install
    cd ..
)

call npm run dev:full

pause