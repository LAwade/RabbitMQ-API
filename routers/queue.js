const queue = require("../middleware/rabbit");
const express = require("express");
const router = express.Router();

router.post("/send", (req, res) => {
  try {
    queue.sendToQueue(req.body.queue, {
      status: 200,
      message: "success",
      queue: req.body.queue,
      data: req.body,
    });

    return res.status(200).send({ status: 200, message: "success" });
  } catch (e) {
    return res.status(400).send({
      status: 400,
      message: `There was a problem your request! ${e.message}`,
    });
  }
});

router.get("/received/:queue", (req, res, next) => {
  try {
    queue.consume(req.params.queue, (message) => {
      console.log(message);
      let data = JSON.parse(message.content.toString());
      if (req.params.bot == data.bot) {
        res
          .status(200)
          .send({ status: 200, message: "success", data: data.data });
      } else {
        res
          .status(404)
          .send({ status: 200, message: "error", message: "Not found" });
      }
    });
  } catch (e) {
    return res
      .status(400)
      .send({ status: 400, message: "There was a problem your request!" });
  }
});

module.exports = router;
