FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM registry.access.redhat.com/ubi9/nginx-122

USER root

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R 1001:0 /usr/share/nginx/html

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
