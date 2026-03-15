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

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy backend package files first for caching
COPY package*.json ./
RUN npm install --production

# Copy built frontend from stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy the rest of the application
COPY . .

# Ensure we don't overwrite the built frontend if it exists in the root
# Also ensure backend folders exist
RUN mkdir -p backend/uploads backend/input backend/output

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "backend/server.js"]
