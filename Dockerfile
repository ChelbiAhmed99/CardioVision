# Development/Production hybrid for Backend
FROM node:22-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start the server (this runs sequelize sync with alter:true)
CMD ["npm", "start"]
