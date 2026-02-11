# Script pour démarrer le serveur Next.js
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage du serveur Next.js..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\frontend"

Write-Host "Port: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Magenta
Write-Host ""

npm run dev
