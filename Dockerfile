FROM node:alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY package.json package-lock.json customerService.js invoiceService.js /usr/src/
RUN npm install
EXPOSE 3000 9229
