FROM expressgateway/express-gateway

WORKDIR /data

COPY apiroot.js jwtScopes.js /usr/src/
COPY ./config/gateway.config.yml ./config/system.config.yml /var/lib/eg/
