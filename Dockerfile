FROM node:alpine

RUN apk update

RUN apk add git

WORKDIR /usr/app

RUN git clone -b develop https://lawade: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@github.com/LAwade/RabbitMQ-API.git

WORKDIR /usr/app/RabbitMQ-API

RUN mv .env_example .env

RUN npm install

EXPOSE 3004

COPY docker-entrypoint.sh ./

RUN chmod 755 docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "start"]