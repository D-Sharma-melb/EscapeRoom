# Development Dockerfile for Next.js application
FROM node:20-alpine

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the development port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
