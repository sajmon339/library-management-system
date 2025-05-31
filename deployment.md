# Library Management System Deployment Guide

This guide provides the necessary commands to deploy the Library Management System using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- Git repository cloned to your local machine

## Deployment Options

### Using the Rebuild Script

We've created a convenient script that handles the entire deployment process:

```bash
# Regular rebuild (preserves database data)
./rebuild.sh

# Force rebuild including database reset (use when schema changes)
./rebuild.sh -f
```

### Manual Deployment Steps

1. First, navigate to the project directory:

```bash
cd /path/to/library-management-system
```

2. If you have existing containers running, stop and remove them:

```bash
docker compose down
```

3. If you need to reset the database (e.g., for schema changes):

```bash
docker volume rm library-management-system_postgres_data
```

4. Build and start the application stack:

```bash
docker compose up --build -d
```

5. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8080/api

## Monitoring and Logs

To view logs from running containers:

```bash
docker-compose logs
```

To follow logs in real-time:

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs -f frontend  # For frontend logs
docker-compose logs -f api       # For API logs
docker-compose logs -f db        # For database logs
```

## Stopping the Application

To stop the application while preserving the containers:

```bash
docker-compose stop
```

To stop and remove the containers, networks, and volumes:

```bash
docker-compose down
```

If you also want to remove the images:

```bash
docker-compose down --rmi all
```

## Common Issues and Troubleshooting

### Database Connection Issues

If the API fails to connect to the database, ensure the database container is running:

```bash
docker ps | grep postgres_db
```

You may need to restart the services:

```bash
docker-compose restart
```

### Frontend Not Loading

If the frontend isn't loading correctly, check if the frontend container is running:

```bash
docker ps | grep library_frontend
```

Inspect the frontend logs:

```bash
docker-compose logs frontend
```

### API Errors

For API issues, check the API logs:

```bash
docker-compose logs api
```

## Updating the Application

When updates are available:

1. Pull the latest code:

```bash
git pull
```

2. Rebuild and restart the containers:

```bash
docker-compose down
docker-compose build
docker-compose up
```

## Verifying Admin Login

Login with the admin credentials (likely admin@library.com / admin123)

```bash
# Login to the admin user with curl
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"Admin123!"}' \
  http://localhost:8080/api/auth/login
```

This will log in and return a JWT token plus user data if successful. The fixed admin credentials are:

- Email: admin@library.com
- Password: Admin123!

Test the book management functionality including the new cover image upload
Verify that user profile editing works correctly
Test the checkout and return book functionality
cloudflared tunnel run wsburritotunnel