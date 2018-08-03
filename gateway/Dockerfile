FROM expressgateway/express-gateway

RUN yarn global add express-jwt-authz kubernetes-client JSONStream

COPY /app /app

COPY ./config/ /var/lib/eg/
