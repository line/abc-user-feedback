# Build stage
FROM node:16-alpine AS builder
WORKDIR /pre

ENV NODE_OPTIONS="–max_old_space_size=4096"
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk --no-cache add --virtual builds-deps build-base python3

COPY . .
RUN yarn --frozen-lockfile
RUN yarn build:server
RUN yarn build:client
RUN yarn install --production --ignore-scripts --prefer-offline

# Runtime stage
FROM node:16-alpine

WORKDIR /usr/app

ENV NODE_ENV production

COPY --from=builder /pre/public ./public
COPY --from=builder /pre/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /pre/dist ./dist
COPY --from=builder /pre/template ./template
COPY --from=builder /pre/.next ./.next
COPY --from=builder /pre/node_modules ./node_modules
COPY --from=builder /pre/package.json ./package.json

EXPOSE 3000

CMD yarn start

