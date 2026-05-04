# Make this excecutable with: "chmod +x updateNPM.sh"

#!/usr/bin/env bash
set -e

# Install, update & audit npm packages on frontend and backend
# To also update the npm itself: npm update -g npm

echo "Updating frontend"
cd frontend || exit 1
npm install vite@latest
npm install
npm audit fix
cd ..

echo "----------------------------------"
echo "Updating backend"
cd backend || exit 1
npm install
npm audit fix
cd ..