# Build stage
FROM node:20.10-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build arguments for API keys and URLs
ARG VITE_GUARDIAN_API_KEY
ARG VITE_GUARDIAN_API_URL
ARG VITE_NEWS_API_KEY
ARG VITE_NEWS_API_URL
ARG VITE_NY_TIMES_API_KEY
ARG VITE_NY_TIMES_API_URL

# Set environment variables for build time
ENV VITE_GUARDIAN_API_KEY=$VITE_GUARDIAN_API_KEY
ENV VITE_GUARDIAN_API_URL=$VITE_GUARDIAN_API_URL
ENV VITE_NEWS_API_KEY=$VITE_NEWS_API_KEY
ENV VITE_NEWS_API_URL=$VITE_NEWS_API_URL
ENV VITE_NY_TIMES_API_KEY=$VITE_NY_TIMES_API_KEY
ENV VITE_NY_TIMES_API_URL=$VITE_NY_TIMES_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]