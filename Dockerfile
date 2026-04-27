# ── base: shared deps install ─────────────────────────────────────────────────
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

# ── development: hot-reload with nodemon ──────────────────────────────────────
FROM base AS development
RUN npm install
COPY . .
ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ── build: compile TypeScript ─────────────────────────────────────────────────
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ── production: lean runtime image ───────────────────────────────────────────
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY .sequelizerc entrypoint.sh ./
EXPOSE 3000
ENTRYPOINT ["sh", "entrypoint.sh"]
CMD ["npm", "start"]
