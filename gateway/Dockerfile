FROM node:alpine

ENV NODE_ENV production
ENV CHOKIDAR_USEPOLLING true

RUN mkdir -p /usr/src
RUN apk add --no-cache bash git openssh

WORKDIR /usr/src

COPY package.json server.js apiroot.js /usr/src/
COPY ./config /usr/src/config
RUN npm install

EXPOSE 8080 9876

CMD ["npm", "start"]
