# Multi-stage Dockerfile for CardioVision Web Portal

# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Backend Image
FROM node:20-bookworm-slim
WORKDIR /app

# Install minimal build dependencies for native modules (sqlite3)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy root package.json and install backend dependencies
COPY package*.json ./
RUN npm install --production --build-from-source=sqlite3

# Copy only the necessary backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Ensure uploads directory exists
RUN mkdir -p backend/uploads

# Expose port and start
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "backend/server.js"]
