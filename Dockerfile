FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY .sequelizerc ./

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/seeders ./src/seeders
COPY --from=builder /app/src/config/database.js ./src/config/database.js
COPY .sequelizerc ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
