# Script pour démarrer les deux serveurs dans des fenêtres PowerShell séparées
Write-Host "Démarrage des serveurs..." -ForegroundColor Cyan

# Démarrer Laravel dans une nouvelle fenêtre
Start-Process PowerShell -ArgumentList "-NoExit", "-File", "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\mon-projet\StartBackend.ps1"

# Attendre un peu avant de lancer Next.js
Start-Sleep -Seconds 3

# Démarrer Next.js dans une autre fenêtre
Start-Process PowerShell -ArgumentList "-NoExit", "-File", "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\StartFrontend.ps1"

Write-Host ""
Write-Host "✅ Les deux serveurs sont en cours de lancement..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000/api/products" -ForegroundColor Cyan
