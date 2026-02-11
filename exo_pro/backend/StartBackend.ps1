# Script pour démarrer le serveur Laravel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage du serveur Laravel..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\mon-projet"

Write-Host "Port: http://localhost:8000" -ForegroundColor Yellow
Write-Host "API: http://localhost:8000/api/products" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Magenta
Write-Host ""

php artisan serve --port=8000
