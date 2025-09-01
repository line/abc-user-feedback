# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!
FROM node:22.19.0-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

RUN apk add --no-cache libc6-compat
RUN apk --no-cache add --virtual .builds-deps build-base python3

WORKDIR /app

RUN npm install -g node-gyp corepack@latest
RUN corepack enable

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json ./
COPY .turbo/ ./.turbo/
COPY .git/ ./.git/


COPY --from=builder /app/apps/web/.env.build /app/apps/web/.env.production
RUN SKIP_ENV_VALIDATION=true pnpm dlx turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

# install usermod and change node user to 1001
RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories
RUN apk --no-cache add shadow
RUN groupmod -g 1001 node \
  && usermod -u 1001 -g 1001 node

# Don't run production as root
RUN addgroup --system --gid 3000 nodejs
RUN adduser --system -G nodejs --uid 1000 nextjs -D
USER nextjs

COPY --from=installer /app/apps/web/next-i18next.config.js .
COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .
COPY --from=installer /app/apps/web/.env.production ./apps/web/.env.production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/entrypoint.sh ./apps/web/entrypoint.sh

ENTRYPOINT ["apps/web/entrypoint.sh"]

CMD ["node", "apps/web/server.js"]