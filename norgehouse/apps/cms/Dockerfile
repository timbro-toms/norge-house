FROM node:20-alpine AS base
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cms/package.json ./apps/cms/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile --filter @norgehouse/cms...

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY . .
WORKDIR /app/apps/cms
RUN pnpm build

# Production stage
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules
COPY --from=builder /app/apps/cms/.next ./apps/cms/.next
COPY --from=builder /app/apps/cms/public ./apps/cms/public
COPY --from=builder /app/apps/cms/src ./apps/cms/src
COPY --from=builder /app/apps/cms/next.config.mjs ./apps/cms/
COPY --from=builder /app/apps/cms/tsconfig.json ./apps/cms/
COPY --from=builder /app/apps/cms/package.json ./apps/cms/
COPY --from=builder /app/packages/types ./packages/types
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN mkdir -p /app/apps/cms/media
VOLUME /app/apps/cms/media

WORKDIR /app/apps/cms
EXPOSE 3001
CMD ["pnpm", "start"]
