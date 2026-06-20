FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build
COPY package.json package-lock.json nuxt.config.ts ./
COPY app/ ./app
RUN npm ci && npm run build

FROM base AS runner
COPY --from=build /app/.output ./.output
COPY package.json ./
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
