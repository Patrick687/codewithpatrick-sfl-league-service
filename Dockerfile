# Multi-stage build for League Service
FROM node:20-alpine AS base

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=docker
RUN npm install
COPY . .
EXPOSE 3002 9231
CMD ["npm", "run", "dev:docker"]

# Production build stage
FROM base AS build
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S league -u 1001

WORKDIR /app

# Copy built application
COPY --from=build --chown=league:nodejs /app/dist ./dist
COPY --from=build --chown=league:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=league:nodejs /app/package*.json ./

USER league

EXPOSE 3002

CMD ["npm", "start"]