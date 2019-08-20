FROM node:10.15.3

RUN mkdir /app
WORKDIR /app
VOLUME /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . /app/

CMD node server.js
