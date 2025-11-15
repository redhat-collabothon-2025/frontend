FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS builder

USER 0

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build

FROM registry.access.redhat.com/ubi9/nginx-124:latest

USER 0

COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R 1001:0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html && \
    chown -R 1001:0 /var/log/nginx /var/lib/nginx /run && \
    chmod -R g=u /var/log/nginx /var/lib/nginx /run

COPY <<'EOF' /etc/nginx/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        error_page 404 /index.html;

        location = /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

RUN chmod g=u /etc/nginx/nginx.conf

USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

