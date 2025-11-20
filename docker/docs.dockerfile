
FROM node:22.21.1-alpine AS base

# ---- Builder Stage ----
FROM base AS builder

WORKDIR /app

RUN npm install -g turbo

COPY . .

# Only isolate needed parts for docs
RUN turbo prune --scope=docs --docker

# ---- Installer Stage ----
FROM base AS installer

WORKDIR /app

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
RUN pnpm dlx turbo run build --filter=docs...


# ---- Runner Stage ----
FROM installer AS runner

EXPOSE 3000

WORKDIR /app/apps/docs
CMD ["pnpm", "start", "--host", "0.0.0.0", "--no-open"]
