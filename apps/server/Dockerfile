FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/package.json ./packages/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json

RUN npm ci

FROM deps AS build
WORKDIR /app

COPY packages ./packages
COPY apps/server ./apps/server

RUN npm run build:shared
RUN npm run build -w server

FROM node:22-alpine AS runtime
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/package.json ./packages/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json

RUN npm ci --include=dev

ENV NODE_ENV=production

COPY --from=build /app/packages/dist ./packages/dist
COPY packages/src ./packages/src
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY apps/server/src ./apps/server/src
COPY --from=build /app/apps/server/drizzle ./apps/server/drizzle
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

WORKDIR /app/apps/server
EXPOSE 3000

CMD ["node", "dist/main.js"]
