# Build stage
FROM node:24-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.25.4-alpine

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directories for uploads and copy images
RUN mkdir -p /usr/share/nginx/uploads/covers && \
    mkdir -p /usr/share/nginx/html/assets

# Copy placeholder image to both locations for fallback
COPY public/placeholder-cover.svg /usr/share/nginx/html/assets/book-placeholder.jpg
COPY public/placeholder-cover.svg /usr/share/nginx/html/book-placeholder.jpg

# Create a volume mount point for book covers
VOLUME /usr/share/nginx/uploads/covers

# We'll use the Docker volume for book covers instead of copying
# The COPY command was causing errors since we can't access files outside the build context

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
