const amqp = require('amqplib')
require('dotenv').config()

const connect = () => {
    const rabbitSettings = {
        protocol: process.env.RABBIT_PROTOCOL,
        hostname: process.env.RABBIT_HOST,
        port: process.env.RABBIT_PORT,
        username: process.env.RABBIT_USER,
        password: process.env.RABBIT_PASSWD,
        vhost: process.env.RABBIT_VHOST,
        authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
    }
    return amqp.connect(rabbitSettings).then(conn => conn.createChannel());
}

const createQueue = (channel, queue) => {
    return new Promise((resolve, reject) => {
        try {
            channel.assertQueue(queue, { durable: true });
            resolve(channel);
        }
        catch (err) { reject(err) }
    });
}

const sendToQueue = (queue, message) => {
    connect()
        .then(channel => createQueue(channel, queue))
        .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
        .catch(err => console.log(err))
}

const consume = (queue, callback) => {
    connect()
        .then(channel => createQueue(channel, queue))
        .then(channel => channel.consume(queue, callback, { noAck: true }))
        .catch(err => console.log(err));
}

module.exports = {
    sendToQueue,
    consume
}