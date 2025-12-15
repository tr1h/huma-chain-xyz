# Local Development Server for Solana Tamagotchi
Write-Host "🚀 Starting local dev server..." -ForegroundColor Green
Write-Host "📂 Serving from: C:\goooog" -ForegroundColor Cyan
Write-Host "🌐 Open in browser: http://localhost:8000/tamagotchi-game.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start Python simple HTTP server
python -m http.server 8000
