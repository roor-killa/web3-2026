# ---------- BASE ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- DEPENDENCIES ----------
FROM base AS deps
RUN npm install

# ---------- BUILD ----------
FROM deps AS build
COPY . .
RUN npm run build

# ---------- PRODUCTION ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what we need
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
