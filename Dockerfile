# Build stage for frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install build dependencies for better-sqlite3 and other native modules
RUN apk add --no-cache python3 make g++

# Copy backend dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend source
COPY backend ./backend

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "backend/server.js"]
