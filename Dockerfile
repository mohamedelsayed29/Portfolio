FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Only the public widget key is available to the frontend build.
ARG TURNSTILE_PUBLIC_SITE_ID

COPY . .
RUN VITE_TURNSTILE_SITE_KEY="$TURNSTILE_PUBLIC_SITE_ID" npm run build

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

RUN mkdir -p /app/security-state && chown node:node /app/security-state

USER node

EXPOSE 4000

CMD ["node", "server/index.js"]
