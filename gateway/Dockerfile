FROM expressgateway/express-gateway

WORKDIR /data

RUN yarn global add express-jwt-authz

COPY apiroot.js jwtScopes.js /data/
COPY ./config/ /var/lib/eg/
