FROM node:20-alpine AS base
RUN corepack enable

# Development stage
FROM base AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
EXPOSE 3001
CMD ["pnpm", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/seed ./src/seed

RUN mkdir -p /app/media
VOLUME /app/media

EXPOSE 3001
CMD ["sh", "-c", "node dist/server.js"]
