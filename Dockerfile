FROM node:alpine

RUN apk add git

WORKDIR /usr/app

RUN git https://github.com/LAwade/RabbitMQ-API.git

WORKDIR /usr/app/RabbitMQ-API

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]