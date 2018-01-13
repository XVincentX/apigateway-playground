FROM node:8-alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY package.json package-lock.json /usr/src/
RUN npm install
EXPOSE 3000 9229
