# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

COPY src ./src

EXPOSE 3010
CMD ["node", "src/server.js"]
