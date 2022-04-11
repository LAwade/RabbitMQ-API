FROM node:alpine

RUN apk update
RUN apk add git
WORKDIR /usr/app

RUN git clone -b develop https://lawade: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@github.com/LAwade/RabbitMQ-API.git
WORKDIR /usr/app/RabbitMQ-API
RUN mv .env_example .env
RUN npm install
EXPOSE 3004

ENTRYPOINT [ "node" ]

CMD [ "scripts/worker.js" ]

#docker image build -t rabbitworker --no-cache .
#docker run -d --name rabbitworker -e RABBIT_HOST='165.22.3.4' -e RABBIT_PASSWD='guest' -e SERVER_API='http://144.22.138.135:3003' rabbitworker