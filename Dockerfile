FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_URL="https://backend-white-hat-project.apps.cluster-xdhbp.xdhbp.sandbox1403.opentlc.com"

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
