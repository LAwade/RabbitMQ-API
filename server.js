#!/usr/bin/env node

const amqp = require("amqplib/callback_api");
const axios = require("axios");

const queue = "tibiabot";
const host = "165.22.3.4";
const server = "http://144.22.138.135:3003/api/v2/list/";

amqp.connect("amqp://" + host, function (error, connection) {
  connection.createChannel(function (error, channel) {
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
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
  });
});
