const rabbitmq = require("../middleware/rabbit");
const axios = require("axios");
require("dotenv").config();

let queue = "tibiabot";

const server = "http://" + process.argv[2] + "/api/v2/list/";

const sendRequest = async (queue) => {
  await rabbitmq
    .connect()
    .then(async (channel) => await rabbitmq.createQueue(channel, queue))
    .then(async (channel) => {
      await channel.prefetch(1);
      await channel.consume(queue, async (msg) => {
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
      }),
        {
          noAck: true,
        };
    })
    .catch((err) => {
      console.log(err);
    });
};

sendRequest(queue);
