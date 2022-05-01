#!/usr/bin/env node

const amqp = require("amqplib/callback_api");
const axios = require("axios");
require("dotenv").config();

const queue = process.env.RABBIT_QUEUE
const server = `http://${process.env.SERVER_API}/api/v2/list/`;

const options = {
  hostname: process.env.RABBIT_HOST,
  username: process.env.RABBIT_USERNAME,
  password: process.env.RABBIT_PASSWD
}

amqp.connect(options, function (error, connection) {
  connection
    .createChannel(function (error, channel) {
      channel.assertQueue(queue, {
        durable: true,
      });
      channel.prefetch(1);
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );
      channel.consume(
        queue,
        async (msg) => {
          let info = JSON.parse(msg.content.toString());
          await axios
            .post(`${server}${info.data.list}`, {
              world: info.data.world,
              src: info.data.src,
              server: info.data.server,
              guild: info.data.guild,
              url: info.data.url,
            })
            .then((message) => {
              channel.ack(msg);
            })
            .catch((error) => {
              console.log(error);
              if (error.response?.status == 404) {
                console.log("API NOT FOUND OR UNAVAILABLE");
              }
            });
        },
        {
          noAck: false,
        }
      );
    })
})
