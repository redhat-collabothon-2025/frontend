FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./vite.config.js

ENV PORT=8080

EXPOSE 8080

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
