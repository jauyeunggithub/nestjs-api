@echo off
setlocal

echo Starting Docker containers...
docker-compose up --build -d

echo Running migrations inside the app container...
docker exec -it nestjs_app_container_name npm run migration:run

echo Running tests inside the app container...
docker exec -it nestjs_app_container_name npm run test:ci

echo Stopping and removing Docker containers...
docker-compose down

endlocal
echo Done.

