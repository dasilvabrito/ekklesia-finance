# Base stage
FROM node:22-alpine AS base

# Backend Build Stage
FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
# Install ALL dependencies (including devDeps for build)
RUN npm install
COPY backend/ .
RUN npx prisma generate
RUN npm run build

# Frontend Build Stage
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
# Fix for potential memory issues during build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production Runtime Stage
FROM base AS production
WORKDIR /app

# Copy Backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/prisma ./backend/prisma

# Copy Frontend (Serve as static assets from NestJS)
COPY --from=frontend-build /app/frontend/dist ./backend/client

# Install only production dependencies for backend
WORKDIR /app/backend
RUN npm ci --only=production
RUN npx prisma generate

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
