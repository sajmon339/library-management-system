
# Library Management System

A comprehensive library management system with microservices architecture, built with .NET, React, and PostgreSQL.

## Features

- Book management (add, remove, search)
- User authentication and authorization
- Book check-out and return processing
- Admin panel for user and book management
- Responsive UI with Tailwind CSS

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: .NET Core API (C#)
- **Database**: PostgreSQL
- **Communication**: RESTful API
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose
- .NET SDK (for development)
- Node.js (for development)

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run Docker Compose:

```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:8080
   - Swagger Documentation: http://localhost:8080/swagger

### Default Login

An admin user is automatically created on first run:

- Email: admin@library.com
- Username: admin
- Password: Admin123!

You can use these credentials to log in to the system and access all administrative features.

## Development Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend/LibraryAPI
```

2. Run the API:
```bash
dotnet run
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend/library-client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## OOP Features Implemented

- **Classes**: User, Book, CheckOut, and service classes
- **Interfaces**: IBookService, IUserService, ICheckOutService, IEmailService
- **Enums**: Genre, UserRole, CheckOutStatus
- **Inheritance**: Service implementations inherit from interfaces
- **Design Patterns**: Repository pattern, Dependency Injection

## License

This project is licensed under the MIT License.
