FROM node:8-alpine

ENV NODE_ENV production
ARG FILE

WORKDIR /usr/src

COPY package.json package-lock.json /usr/src/
RUN npm install

COPY $FILE /usr/src/index.js

EXPOSE 3000

CMD npm start
