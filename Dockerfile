FROM node:alpine

RUN apk update

RUN apk add git

WORKDIR /usr/app

RUN git clone -b worker https://lawade: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@github.com/LAwade/RabbitMQ-API.git

WORKDIR /usr/app/RabbitMQWorker

RUN mv .env_example .env

RUN npm install

CMD ["npm", "start"]