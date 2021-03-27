const express = require('express')
const router = express.Router()
const psql = require('../postgres').pool
const jwt = require('../middleware/login')
const table = 'band'

/** 
 * API GET: Busca todos os cantores/bandas com a possibilidade de realizar consultas parametrizadas.
 * 
 * Exemplo: 
 * Buscar Todos: http://127.0.0.1:3003/band
 * Buscar por banda: http://127.0.0.1:3003/band/Mike Shinoda/
 * Buscar por banda e ordenar: http://127.0.0.1:3003/band/Mike Shinoda/desc
 */
router.get('/:name*?/:order*?', jwt, (req, res) => {
    const query = {
        text: 'SELECT * FROM ' + table + ' WHERE 1=1 ',
        values: []
    }

    if (req.params.name) {
        query.values.push(req.params.name)
        query.text += " AND name_band = $1 "
    }

    if (req.params.order && (req.params.order.toLocaleUpperCase() == 'DESC' || req.params.order.toLocaleUpperCase() == 'ASC')) {
        query.text += "ORDER BY 1 " + req.params.order
    } else {
        query.text += "ORDER BY 1 ASC"
    }

    psql.query(query, (err, response) => {
        if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })
        if (response.rowCount) {
            return res.status(200).send({ status: 200, message: 'success', data: response.rows })
        }
        return res.status(400).send({ status: 400, message: 'No results found!' })
    })
})

/** 
 * API POST: Insere um novo registro com os dados passados na request por JSON.
 * 
 * Exemplo: 
 *  {
 *    "name_band": "Andrea Bocelli",
 *    "birth_band": "1958-09-26",
 *    "country_band": "Italy"
 *  }
 */
router.post('/', jwt, (req, res, next) => {

    const column = ['name_band', 'birth_band', 'country_band']

    const query = {
        text: 'INSERT INTO  ' + table + ' (name_band, birth_band, country_band) ' +
            'VALUES($1, $2, $3);',
        values: []
    }

    Object.keys(req.body).forEach((e) => {
        if (req.body[e] && column.indexOf(e) > -1) {
            query.values.push(req.body[e])
        }
    })

    psql.query(query, (err, response) => {
        if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })
        if (response.rowCount) {
            return res.status(201).send({ status: 201, message: 'success' })
        }
        return res.status(400).send({ status: 400, message: 'No results found!' })
    })
})

/** 
 * API PUT: Atualiza registro com o identificado passado na URL.
 * 
 * Exemplo: 
 *   Request -> https://127.0.0.1/band/1
 *     {"name_band": "AC/DC", "birth_band": "1938-01-12", "country_band": "United States"}
 *  
 *   Response <- {"status": 202, "message": "success"}
 */
router.put('/:id', jwt, (req, res) => {
    const query = {
        text: 'UPDATE ' + table + ' SET ',
        values
    }

    Object.keys(req.body).forEach((e, v) => {
        if (e != 'id_' + table && e != 'updated_at' && e != 'created_at') {
            query.values.push(req.body[e])
            query.text += e + " = $" + (v + 1)
            if (Object.keys(req.body).length >= (v + 1)) {
                query.text += ", "
            }
        }
    })

    if (req.params.id) {
        query.text += " updated_at = now() "
        query.text += " WHERE id_" + table + " = " + req.params.id
    } else {
        return res.status(400).send({ status: 400, message: 'Identifier is required!' })
    }

    psql.query(query, (err, response) => {
        if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })
        if (response.rowCount) {
            return res.status(202).send({ status: 202, message: 'success' })
        }
        return res.status(400).send({ status: 400, message: 'No results found!' })
    })
})

/** Deleta um autor informado pelo id */
router.delete('/:id', jwt, (req, res) => {
    const query = {
        text: 'DELETE FROM ' + table + ' WHERE id_band = $1 ',
        values: [req.params.id]
    }

    psql.query(query, (err, response) => {
        if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })
        if (response.rowCount) {
            return res.status(202).send({ status: 202, message: 'success' })
        }
        return res.status(400).send({ status: 400, message: 'No results found!' })
    })
})

module.exports = router