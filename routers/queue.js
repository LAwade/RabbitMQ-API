const queue = require("../middleware/rabbit");
const express = require('express')
const request = require('request')
const router = express.Router()

router.post('/send', (req, res) => {
    try {
        request(req.body.url + '/api/tibia/' + req.body.list + '/' + req.body.src + '/' + req.body.server + '/' + req.body.guild, function (erro, response, body) {
            if (!erro && res.statusCode == 200) {
                let data = JSON.parse(response.body)
                queue.sendToQueue(req.body.queue, { status: 200, message: 'success', bot: req.body.bot, data: data.data })
                res.status(200).send({ status: 200, message: 'success' })
            } else {
                return res.status(400).send({ status: 400, message: 'Request fail' })
            }
        })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

router.get('/received/:queue/:bot', (req, res) => {
    try {
        queue.consume(req.params.queue, message => {
            let data = JSON.parse(message.content.toString())
            res.status(200).send({ status: 200, message: 'success', data: data.data })
        })
        
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

module.exports = router