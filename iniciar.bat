@echo off
title ERP Logistica DEV - Asepsis
cd /d "C:\Users\willi\Desktop\ERP-LOGISTICA-DEV"
echo ==============================================
echo   Iniciando ERP Asepsis - Modulo Logistica
echo   Base de datos: SQLite Local (100% Seguro)
echo ==============================================
echo.
start http://localhost:3005
npm run dev
pause
