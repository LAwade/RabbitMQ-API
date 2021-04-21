const queue = require("../middleware/rabbit");
const express = require('express')
const request = require('request')
const util = require('util');
const { Console } = require("console");
const { addlist } = require("../models/list");
const router = express.Router()

const requestPromise = util.promisify(request);

router.post('/send', (req, res) => {
    try {
        request(req.body.url + '/api/tibia/' + req.body.list + '/' + req.body.src + '/' + req.body.server + '/' + req.body.guild, function (erro, response, body) {
            if (!erro && res.statusCode == 200) {
                let data = JSON.parse(response.body)
                queue.sendToQueue(req.body.queue, { status: 200, message: 'success', queue: req.body.queue, bot: req.body.bot, data: data.data })
            }
        })
        return res.status(200).send({ status: 200, message: 'success' })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

router.post('/process', async (req, res) => {
    try {

        let lists = req.body.list;
        let listAll = ['neutrals', 'deaths']
        let dataAPI = {
            bot: req.body.bot,
            server: req.body.server,
            world: req.body.world,
            queue: req.body.queue,
            data: []
        }

        async function done() {
            async function getWeather(url) {
                return requestPromise(url).then(response => {
                    if (response.statusCode === 200) {
                        return response.body
                    }
                    return Promise.reject(response.statusCode)
                }).catch(err => {
                    return err
                })
            }

            for (let lst in lists) {
                /** REALIZA A BUSCA DOS NEUTRALS LIST E DEATHS */
                if (dataAPI.data.length == 0) {
                    try {
                        if (req.body.world && req.body.world != 'opentibia' && req.body.server == 'Global') {
                            /** GLOBAL SERVER */
                            /** NEUTRALS */
                            let n = await getWeather("https://api.tibiadata.com/v2/world/" + req.body.world + ".json")
                            let d = JSON.stringify({ data: JSON.parse(n).world.players_online })
                            let oldNeutrals = await addlist(req.body.bot, 'neutrals', d)
                            dataAPI.data.push({ type: 'neutrals', data: d, dataOld: oldNeutrals });

                            /** DEATHS */
                            n = await getWeather(req.body.url + '/api/tibia/deaths/' + req.body.src + '/' + req.body.server + '/' + lists[lst][0])
                            let oldDeaths = await addlist(req.body.bot, 'deaths', n)
                            dataAPI.data.push({ type: 'deaths', data: n, dataOld: oldDeaths });

                        } else {
                            /** OT SERVER */
                            for (let lstAll in listAll) {
                                let n = await getWeather(req.body.url + '/api/tibia/' + listAll[lstAll] + '/' + req.body.src + '/' + req.body.server + '/' + lists[lst][0])
                                let retorno = await addlist(req.body.bot, listAll[lstAll], n)
                                dataAPI.data.push({ type: listAll[lstAll], data: n, dataOld: retorno});
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }

                /** BUSCA AS LISTAS */
                if (req.body.world && req.body.world != 'opentibia' && req.body.server == 'Global') {
                    /** GLOBAL SERVER */
                    for (let lt in lists[lst]) {
                        let t = await getWeather("https://api.tibiadata.com/v2/guild/" + lists[lst][lt] + ".json")
                        let members = JSON.parse(t).guild.members
                        let players = []
                        members.forEach((e, v) => {
                            e.characters.forEach(element => {
                                players.push(element)
                            })
                        });
                        dataAPI.data.push({ guild: lists[lst][lt], type: lst, data: JSON.stringify({ data: players }) });
                    }
                } else {
                    /** OT SERVER */
                    for (let lt in lists[lst]) {
                        let t = await getWeather(req.body.url + '/api/tibia/friends/' + req.body.src + '/' + req.body.server + '/' + lists[lst][lt])
                        dataAPI.data.push({ guild: lists[lst][lt], type: lst, data: t });
                    }
                }
            }
            queue.sendToQueue(req.body.queue, dataAPI)
        }
        done()
        return res.status(200).send({ status: 200, message: 'success' })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

router.get('/received/:queue/:bot', (req, res, next) => {
    try {
        queue.consume(req.params.queue, message => {
            let data = JSON.parse(message.content.toString())
            if (req.params.bot == data.bot) {
                res.status(200).send({ status: 200, message: 'success', data: data.data })
            } else {
                res.status(404).send({ status: 200, message: 'error', message: 'Not found' })
            }
        })

    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

module.exports = router