REM Install, update & audit npm packages on frontend and backend
REM To also update the npm itself: "npm update -g npm"

@echo off

echo Updating frontend
cd frontend
REM call npm install vite@latest
call npm install
call npm audit fix
cd ..

echo ----------------------------------
echo Updating backend
cd backend
call npm install
call npm audit fix
cd ..
