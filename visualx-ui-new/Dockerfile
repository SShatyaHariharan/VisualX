# Stage 1: Build outside container to avoid rollup native issues
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=optional

COPY . .
RUN npm run build

# Stage 2: Serve using a lightweight image
FROM node:18-slim

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]