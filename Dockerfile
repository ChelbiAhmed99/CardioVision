# Multi-stage Dockerfile for CardioVision Web Portal
# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Backend Image
FROM node:20
WORKDIR /app

# Copy root package.json and install backend dependencies
# Build from source to ensure compatibility with the container's glibc version
COPY package*.json ./
RUN npm install --production --build-from-source=sqlite3,better-sqlite3

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
