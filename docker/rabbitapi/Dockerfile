FROM node:alpine

ARG ENTRYPT
ARG COMMAND

ENV ETRY ${ENTRYPT}
ENV CMD ${ENTRYPT}

RUN apk update
RUN apk add git
WORKDIR /usr/app

RUN git clone -b develop https://lawade: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@github.com/LAwade/RabbitMQ-API.git
WORKDIR /usr/app/RabbitMQ-API
RUN mv .env_example .env
RUN npm install

EXPOSE 3004

ENTRYPOINT [ "npm" ]

CMD [ "start" ]
#docker image build -t rabbitapi --no-cache .
#docker run -d --name rabbitapi -e RABBIT_HOST='165.22.3.4' -e RABBIT_PASSWD='guest' rabbitapi