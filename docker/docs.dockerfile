# syntax=docker/dockerfile:1

# ---- Base Node Image ----
  FROM node:22-alpine AS base

  # ---- Builder Stage ----
  FROM base AS builder
  
  RUN apk add --no-cache libc6-compat
  
  WORKDIR /app
  
  RUN npm install -g turbo
  
  COPY . .
  
  # Only isolate needed parts for docs
  RUN turbo prune --scope=docs --docker
  
  # ---- Installer Stage ----
  FROM base AS installer
  
  RUN apk add --no-cache libc6-compat
  RUN apk --no-cache add --virtual .build-deps build-base python3
  
  WORKDIR /app
  
  RUN npm install -g node-gyp corepack@latest
  RUN corepack enable
  
  # Copy pruned workspace
  COPY --from=builder /app/out/json/ .
  COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
  
  # Install only necessary dependencies
  RUN pnpm install --frozen-lockfile
  
  # Copy full source for build
  COPY --from=builder /app/out/full/ .
  COPY turbo.json ./
  COPY .turbo/ ./.turbo/
  COPY .git/ ./.git/
  
  # Build Docusaurus
  WORKDIR /app/apps/docs
  RUN pnpm build
  
  # ---- Runner Stage ----
  FROM base AS runner
  
  WORKDIR /app
  
  # Create non-root user for security
  RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories
  RUN apk --no-cache add shadow
  RUN groupmod -g 1001 node \
    && usermod -u 1001 -g 1001 node
  
  RUN addgroup --system --gid 3000 nodejs
  RUN adduser --system -G nodejs --uid 1000 docusaurus -D
  USER docusaurus
  
  # Only copy the built assets
  COPY --from=installer /app/apps/docs/build ./build
  
  # Expose port
  EXPOSE 3000
  
  # Serve the static build
  CMD ["npx", "serve", "-s", "build", "-l", "3000"]
  