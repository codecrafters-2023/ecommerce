@echo off
E:  REM Switch to E: drive
cd /d "E:\ecommerce\ecommerce"  REM Change to your actual project path

:loop
echo Fetching updates from GitHub...
git fetch origin

echo Resetting local changes...
git reset --hard origin/main  REM Resetting to latest version

echo Pulling latest changes...
git pull origin main  REM Pull updates

echo Git Pull Completed!

:: Kill existing backend process running on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| find ":5000"') do taskkill /PID %%a /F >nul 2>&1

:: Restart Backend Server
echo Restarting Backend Server...
cd backend
start cmd /k "cd /d E:\ecommerce\ecommerce\backend && npm install && npm start"
cd ..

:: Kill existing frontend process running on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000"') do taskkill /PID %%a /F >nul 2>&1

:: Restart Frontend Server
echo Restarting Frontend Server...
cd frontend
start cmd /k "cd /d E:\ecommerce\ecommerce\frontend && npm install && npm start"
cd ..

:: Wait for 10 minutes (600 seconds)
echo Waiting for 10 minutes before next update...
timeout /t 600 /nobreak >nul

:: Loop back to the beginning
goto loop
