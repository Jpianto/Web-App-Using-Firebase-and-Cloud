# Joshua Pianto 9/3/2025 Cloud Run container
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
CMD ["node", "index.js"]
