FROM node:alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY ./ /usr/src/
RUN npm install
EXPOSE 8080 9876
CMD ["npm", "start"]
