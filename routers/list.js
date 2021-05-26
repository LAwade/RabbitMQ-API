const express = require('express')
const { deleteDocuments } = require("../models/list");
const router = express.Router()

router.get('/deleteAll', (req, res) => {
    try {
        deleteDocuments()
        return res.status(200).send({ status: 200, message: 'success' })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem your request!' })
    }
})

module.exports = router