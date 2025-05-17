#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Always force reset the database
FORCE_RESET=true
echo -e "${YELLOW}Database will be reset and recreated during rebuild.${NC}"

# Check for no-reset flag to override the default behavior
if [ "$1" == "--no-reset" ]; then
    FORCE_RESET=false
    echo -e "${GREEN}No-reset flag detected. Database volume will be preserved.${NC}"
fi

# Stop any running containers
echo -e "${GREEN}Stopping any running containers...${NC}"
docker compose down

# Remove database volume if force flag is set
if [ "$FORCE_RESET" = true ]; then
    echo -e "${YELLOW}Removing database volume...${NC}"
    docker volume rm library-management-system_postgres_data || true
    echo -e "${GREEN}Database volume removed.${NC}"
fi

# Build the containers
echo -e "${GREEN}Building containers...${NC}"
docker compose build

# Start the containers
echo -e "${GREEN}Starting containers...${NC}"
docker compose up -d

# Show running containers
echo -e "${GREEN}Running containers:${NC}"
docker compose ps

echo -e "${GREEN}Rebuild complete! The application should be available at:${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "API: http://localhost:8000/api"

echo -e "${YELLOW}Note: It might take a few moments for the database to initialize fully.${NC}"
echo -e "${YELLOW}If you experience any issues, check the logs with: docker compose logs${NC}"

# Admin credentials reminder
echo -e "${GREEN}Admin credentials:${NC}"
echo -e "Email: admin@library.com"
echo -e "Password: Admin123!"
