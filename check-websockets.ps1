# WebSocket Status Checker for Enterprise Architecture App
Write-Host "🔍 Checking WebSocket Services..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Vite dev server (5175)
Write-Host "📡 Vite Development Server (Port 5175):" -ForegroundColor Yellow
$viteRunning = netstat -an | findstr ":5175" | findstr "LISTENING"
if ($viteRunning) {
    Write-Host "✅ RUNNING - Hot Module Replacement active" -ForegroundColor Green
    Write-Host "   WebSocket: ws://localhost:5175" -ForegroundColor Gray
} else {
    Write-Host "❌ NOT RUNNING - Start with 'npm run dev'" -ForegroundColor Red
}
Write-Host ""

# Check voice chat backend (3001)
Write-Host "🎤 Voice Chat Backend (Port 3001):" -ForegroundColor Yellow
$voiceRunning = netstat -an | findstr ":3001" | findstr "LISTENING"
if ($voiceRunning) {
    Write-Host "✅ RUNNING - OpenAI Realtime token server active" -ForegroundColor Green
    Write-Host "   API: http://localhost:3001" -ForegroundColor Gray
} else {
    Write-Host "❌ NOT RUNNING - Voice chat backend not started" -ForegroundColor Red
    Write-Host "   To start: cd server && npm start" -ForegroundColor Gray
}
Write-Host ""

# Check for any other WebSocket services
Write-Host "🌐 Other WebSocket Services:" -ForegroundColor Yellow
$otherSockets = netstat -an | findstr ":8080 :8767 :8000"
if ($otherSockets) {
    Write-Host "Found other services:" -ForegroundColor Green
    $otherSockets | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "No other WebSocket services detected" -ForegroundColor Gray
}
Write-Host ""

# Show WebSocket connections in browser
Write-Host "🔗 Current WebSocket Connections:" -ForegroundColor Yellow
$wsConnections = netstat -an | findstr "ESTABLISHED" | findstr ":5175\|:3001\|:8080"
if ($wsConnections) {
    Write-Host "Active connections found:" -ForegroundColor Green
    $wsConnections | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "No active WebSocket connections" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "📋 WebSocket Summary:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "🎯 Development: Vite HMR on 5175 $(if($viteRunning){'✅'}else{'❌'})"
Write-Host "🎤 Voice Chat: Backend on 3001 $(if($voiceRunning){'✅'}else{'❌'})"
Write-Host "🌍 Production: CloudFront → Nginx → Vite"
Write-Host ""
Write-Host "💡 To enable voice chat:" -ForegroundColor Yellow
Write-Host "   1. cd server" -ForegroundColor Gray
Write-Host "   2. npm install" -ForegroundColor Gray
Write-Host "   3. Add OPENAI_API_KEY to .env" -ForegroundColor Gray
Write-Host "   4. npm start" -ForegroundColor Gray
