# Library Management System - Book Cover Image Implementation

## Issues Identified
1. Book cover images aren't displaying correctly in the UI
2. Getting a 502 Bad Gateway error when trying to fetch books from the API

## System Architecture
- Frontend: React app served via Nginx
- Backend: .NET Core API running on port 8000
- Database: PostgreSQL

## Docker Setup
- Frontend container (`library_frontend`): Serves the React app on port 3000, proxies API requests to backend
- Backend container (`library_api`): Serves the API on port 8000
- Database container (`postgres_db`): PostgreSQL database on port 5432

## Key Findings

### Backend Configuration
- Book cover images are stored in `/app/wwwroot/uploads/covers/` in the backend container
- The API endpoint `/api/books/{id}/cover` serves book cover images
- Static files serving is enabled in Program.cs: `app.UseStaticFiles();`
- The Dockerfile correctly creates the directory and copies book covers:
  ```dockerfile
  # Ensure wwwroot directory exists
  RUN mkdir -p /app/wwwroot/uploads/covers

  # Copy book covers
  COPY ./wwwroot/uploads/covers /app/wwwroot/uploads/covers
  ```

### Frontend Configuration
- The frontend uses `bookService.getBookCover(book.id)` to generate image URLs
- Nginx proxy configuration in `nginx.conf`:
  ```
  # API proxy to prevent CORS issues
  location /api/ {
      proxy_pass http://library_api:8000/api/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
  }
  ```
- API client configured with base URL:
  ```typescript
  // Use a relative URL which will work with the Nginx proxy
  const BASE_URL = import.meta.env.VITE_API_URL || '/api';
  ```

### Error Details
- 502 Bad Gateway error from Nginx when trying to fetch books:
  ```
  API: Response error: 
  Object { url: "/books", status: 502, message: "<!DOCTYPE html>\n<html>\n<head>\n<title>Error</title>\n<style>\nhtml { color-scheme: light dark; }\nbody { width: 35em; margin: 0 auto;\nfont-family: Tahoma, Verdana, Arial, sans-serif; }\n</style>\n</head>\n<body>\n<h1>An error occurred.</h1>\n<p>Sorry, the page you are looking for is currently unavailable.<br/>\nPlease try again later.</p>\n<p>If you are the system administrator of this resource then you should check\nthe error log for details.</p>\n<p><em>Faithfully yours, nginx.</em></p>\n</body>\n</html>\n" }
  ```

## Updates Made to the System
- Updated Book interface to include `coverImagePath` property
- Enhanced ModernBookDetail component to display book covers with fallback
- Enhanced ModernBooks component to show book covers in list view
- Added real book data fetching to ModernHome, replacing mock data
- Implemented proper book cover display in ModernMyBooks
- Created placeholder SVG for when book covers are not available
- Fixed image paths in ModernManageBooks to use bookService
- Built and verified frontend changes with Docker

## Next Steps for Troubleshooting
1. Check if API container is running properly 
2. Verify network connectivity between frontend and backend containers
3. Check logs from the API container for error messages
4. Verify the book cover files exist in the correct location in the API container
5. Test direct API access to rule out frontend proxy issues
