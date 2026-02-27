@echo off
echo ========================================
echo Starting PrimeAcc Full Stack Application
echo ========================================
echo.
echo This will start both Backend and Frontend servers
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3003
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting Backend Server...
start "PrimeAcc Backend" cmd /k "cd backend && node run-dev.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "PrimeAcc Frontend" cmd /k "cd frontend && node run-dev.js"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3003
echo.
echo Check the opened terminal windows for logs
echo.
pause
