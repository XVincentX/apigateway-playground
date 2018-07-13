FROM expressgateway/express-gateway

WORKDIR /data

RUN yarn global add express-jwt-authz kubernetes-client JSONStream

COPY apiroot.js jwtScopes.js /data/
COPY ./config/ /var/lib/eg/
