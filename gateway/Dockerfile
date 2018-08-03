FROM expressgateway/express-gateway

<<<<<<< HEAD
WORKDIR /data

RUN yarn global add express-jwt-authz express-gateway-plugin-body-modifier-example
=======
RUN yarn global add express-jwt-authz
>>>>>>> fac9022... added files in app folder. To make sure they work locally and in container with same configuration.

COPY /app /app

COPY ./config/ /var/lib/eg/
