FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_URL="https://backend-white-hat-project.apps.cluster-xdhbp.xdhbp.sandbox1403.opentlc.com"

RUN npm run build

FROM registry.access.redhat.com/ubi9/nginx-122

USER root

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build --chown=1001:0 /app/dist /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
