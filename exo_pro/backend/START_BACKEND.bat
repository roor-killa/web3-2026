@echo off
title Laravel Backend - E-Shop
color 0A

echo.
echo =====================================
echo   Serveur Laravel Backend
echo =====================================
echo.

cd /d "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\mon-projet"

echo Port: http://localhost:8000
echo API:  http://localhost:8000/api/products
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

php artisan serve --port=8000

pause
