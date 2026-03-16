# Multi-stage Dockerfile for CardioVision Web Portal
# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Backend Image
FROM node:20-slim
WORKDIR /app

# Install native dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy root package.json and install backend dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
