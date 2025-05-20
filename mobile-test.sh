#!/bin/bash

# Script to run the Library Management System for mobile testing
# This script will start the backend API and frontend client on specific ports
# and make them accessible over your local network

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to continue."
    exit 1
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose to continue."
    exit 1
fi

# Get local IP address
LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n 1)

if [ -z "$LOCAL_IP" ]; then
    echo "Could not determine local IP address. Using localhost."
    LOCAL_IP="localhost"
fi

echo "=========================================================="
echo "Starting Library Management System for mobile testing"
echo "=========================================================="
echo "Local IP address: $LOCAL_IP"
echo "API will be available at: http://$LOCAL_IP:5000"
echo "Frontend will be available at: http://$LOCAL_IP:3000"
echo "=========================================================="
echo "For mobile testing:"
echo "1. Connect your mobile device to the same WiFi network"
echo "2. Open the browser on your mobile device"
echo "3. Navigate to http://$LOCAL_IP:3000"
echo "=========================================================="

# Export environment variables for Docker Compose
export LIBRARY_API_URL="http://$LOCAL_IP:5000"

# Start the services with Docker Compose
echo "Starting services..."
docker-compose up --build

# Clean up on exit
function cleanup {
    echo "Stopping services..."
    docker-compose down
}

trap cleanup EXIT
