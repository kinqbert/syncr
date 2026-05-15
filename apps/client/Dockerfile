FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/package.json ./packages/package.json
COPY apps/client/package.json ./apps/client/package.json
COPY apps/server/package.json ./apps/server/package.json

RUN npm ci

FROM deps AS build
WORKDIR /app

ARG CLIENT_API_URL
ARG CLIENT_SOCKET_URL
ENV CLIENT_API_URL=$CLIENT_API_URL
ENV CLIENT_SOCKET_URL=$CLIENT_SOCKET_URL

COPY packages ./packages
COPY apps/client ./apps/client

RUN npm run build:shared
RUN npm run build -w client

FROM nginx:1.27-alpine AS runtime

COPY apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80
