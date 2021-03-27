const express = require('express')
const router = express.Router()
const psql = require('../postgres').pool
const jwt = require('../middleware/login')
const table = 'album'

/** 
 * API GET: Busca todos os album com a possibilidade de realizar consultas parametrizadas.
 * Exemplo: https://127.0.0.1/album?name=Bem Sertanejo&page=1&per_page=5&order=asc
 */
router.get('/', jwt, (req, res) => {

    const query = {
        text: 'SELECT id_album, name_album, genre_album, language_album, record_company_album, name_band, country_band, released_album, array(SELECT url_image FROM image WHERE fk_id_album = a.id_album AND expire_image > now()) AS url_image ' +
            'FROM ' + table + ' a ' +
            'INNER JOIN band b ON a.fk_id_band = b.id_band ' +
            'WHERE 1=1 ',
        values: []
    }

    if (req.query.name) {
        query.values.push(req.query.name)
        query.text += " AND name_album = $1 "
    }

    if (req.query.order && (req.query.order.toLocaleUpperCase() == 'DESC' || req.query.order.toLocaleUpperCase() == 'ASC')) {
        query.text += "ORDER BY 1 " + req.query.order
    } else {
        query.text += "ORDER BY 1 ASC "
    }

    if (req.query.page) {
        let per_page = req.query.per_page ? req.query.per_page : 5;
        let page = (req.query.page - 1) * per_page;
        query.text += " OFFSET " + page + " LIMIT " + per_page
    }

    psql.query(query, (err, response) => {
        if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })
        if (response.rowCount) {
            response.rows
            return res.status(200).send({ status: 200, message: 'success', data: response.rows })
        }
        return res.status(404).send({ status: 404, message: 'No results found!' })
    })
})

/** 
 * API POST: Insere um novo registro com os dados passados no body formato JSON.
 * 
 * Exemplo: 
 *  {"name_album": "Rock or Bust",
 *   "released_album": "2014-11-28",
 *   "genre_album": "Rock",
 *   "language_album": "English",
 *   "format_album": "CD, MP3, Digital",
 *   "record_company_album": "Albert/Columbia",
 *   "fk_id_band": 1}
 */
router.post('/', jwt, (req, res) => {

    const column = ['name_album', 'released_album', 'genre_album', 'language_album', 'format_album', 'record_company_album', 'fk_id_band']

    const query = {
        text: 'INSERT INTO  ' + table + ' (name_album, released_album, genre_album, language_album, format_album, record_company_album, fk_id_band) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7);',
        values: []
    }

    Object.keys(req.body).forEach((e, v) => {
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
 *   Request -> https://127.0.0.1/album/1
 *     {"genre_album": "Classic", "format_album": "CD, MP3, Digital"}
 *  
 *   Response <- {"status": 202, "message": "success"}
 */
router.put('/:id', jwt, (req, res) => {
    const query = {
        text: 'UPDATE ' + table + ' SET ',
        values: []
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

/** 
 * API DELETE: Exclui o resgistro com o identificador na URL.
 * Exemplo: https://127.0.0.1/album/id
 */
router.delete('/:id', jwt, (req, res) => {
    const query = {
        text: 'DELETE FROM ' + table + ' WHERE id_album = $1 ',
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