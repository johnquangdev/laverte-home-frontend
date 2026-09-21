# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.12.3 && pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG API_ROOT=http://localhost:14000/api/v1
ARG NEXT_PUBLIC_API_ROOT=http://localhost:14000/api/v1
ENV API_ROOT=$API_ROOT
ENV NEXT_PUBLIC_API_ROOT=$NEXT_PUBLIC_API_ROOT
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@9.12.3
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["pnpm", "start"]
