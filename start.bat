@echo off
REM Start backend and frontend in separate terminals

set "ROOT=%~dp0"

echo starting backend
start "backend" cmd /k "cd /d %ROOT%backend && npm run dev"

echo ----------------------------------

echo starting frontend
start "frontend" cmd /k "cd /d %ROOT%frontend && npm run dev"


