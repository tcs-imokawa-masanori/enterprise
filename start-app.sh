#!/bin/bash

echo "========================================"
echo "Starting Enterprise Architecture Assistant"
echo "========================================"
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

# Check if server dependencies exist
if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..
    echo
fi

echo "Starting services..."
echo

# Function to kill processes on exit
cleanup() {
    echo
    echo "Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch exit signals
trap cleanup EXIT INT TERM

# Start the backend server
echo "[1/2] Starting Backend Server on port 3001..."
npm run server &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start the frontend dev server
echo "[2/2] Starting Frontend Dev Server on port 5175..."
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "All services started!"
echo "========================================"
echo
echo "Frontend: http://localhost:5175"
echo "Backend:  http://localhost:3001"
echo
echo "Voice Chat is enabled and ready to use!"
echo
echo "Opening app in browser..."

# Wait a moment then open browser
sleep 3

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5175
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5175 2>/dev/null || echo "Please open http://localhost:5175 in your browser"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    start http://localhost:5175
fi

echo
echo "Press Ctrl+C to stop all services"
echo

# Keep script running
wait