FROM node:20-alpine AS base
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile --filter @norgehouse/web...

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ARG NEXT_PUBLIC_PAYLOAD_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_PAYLOAD_URL=$NEXT_PUBLIC_PAYLOAD_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

WORKDIR /app/apps/web
RUN pnpm build

# Production stage — standalone output
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/web
CMD ["node", "server.js"]
