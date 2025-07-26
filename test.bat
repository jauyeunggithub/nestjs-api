@echo off
setlocal

echo Starting Docker containers...
docker-compose up --build -d

REM Wait a few seconds for containers to start properly
timeout /t 5 /nobreak > nul

echo Running migrations inside the app container...
docker exec -it app npm run migration:run

echo Running tests inside the app container...
docker exec -it app npm run test:ci

echo Stopping and removing Docker containers...
docker-compose down

endlocal
echo Done.

