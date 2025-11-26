@echo off
echo 🎤 Setting up OpenAI Realtime Voice Chat for Enterprise Architecture Assistant
echo ==================================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed  
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Navigate to server directory
cd server

REM Install server dependencies
echo 📦 Installing server dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo ⚙️  Creating .env file from template...
    copy env.example .env
    echo.
    echo 🔑 IMPORTANT: Please add your OpenAI API key to server\.env file:
    echo    OPENAI_API_KEY=your_openai_api_key_here
    echo.
    echo 💡 You can get your API key from: https://platform.openai.com/api-keys
    echo.
) else (
    echo ✅ .env file already exists
)

REM Go back to project root
cd ..

echo.
echo 🚀 Setup complete! To start the voice chat server:
echo.
echo    1. Add your OpenAI API key to server\.env
echo    2. Run: cd server ^&^& npm start
echo    3. Start your main app: npm run dev
echo.
echo 🎯 The voice chat will be available in the AI Assistant chat interface
echo    - Click the phone icon to start realtime voice chat
echo    - Click the mic icon for voice-to-text input
echo.
echo 📋 Requirements:
echo    - OpenAI API key with Realtime API access
echo    - Microphone access in browser
echo    - HTTPS (for production) or localhost (for development)
echo.
echo 🔧 Troubleshooting:
echo    - Check browser console for errors
echo    - Ensure microphone permissions are granted
echo    - Verify OpenAI API key has Realtime API access
echo.
pause
