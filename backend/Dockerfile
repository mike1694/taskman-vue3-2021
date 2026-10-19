FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx tsc

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "dist/index.js"]
