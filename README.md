# RabbitMQ-API
Container Docker RabbitMQ-API

docker run -it -d --name rabbitapi -p 3005:3005/tcp rabbitapi
------------------------------------------------------------------------------------------------------
Dependencies:

#Docker

#RabbitMQ

Docker RabbitMQ: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

------------------------------------------------------------------------------------------------------
Configure

.env_example to .env

Modify variables:

RABBIT_HOST
RABBIT_PORT
RABBIT_USER
RABBIT_PASSWD
