const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const psql = require('../postgres').pool
const table = 'client'

/** 
 * API POST: Insere um novo registro com os dados passados na request em formato JSON.
 * 
 * Exemplo: 
 *  {
 *    "fullname_client": "Lucas Awade Teixeira Silva",
 *    "email_client": "lucasawade46@gmail.com",
 *    "user_client": "awade",
 *    "password_client" : "NaoCompreiWEGE3"
 *  }
 */
router.post('/create', (req, res) => {
    try {
        const column = ['fullname_client', 'email_client', 'user_client', 'password_client']

        const query = {
            text: 'INSERT INTO  ' + table + ' (fullname_client, email_client, user_client, password_client) ' +
                'VALUES($1, $2, $3, $4);',
            values: []
        }

        column.forEach((e, v) => {
            if (!req.body[e]) {
                throw new Error('There was a problem near ' + e)
            }
            if (e == 'password_client') {
                bcrypt.hash(req.body.password_client, 10, (berror, hash) => {
                    query.values.push(hash)
                });
            } else {
                query.values.push(req.body[e])
            }
        });

        psql.query('SELECT * FROM client WHERE (email_client = $1 OR user_client = $2);', [req.body.email_client, req.body.user_client], (error, resp) => {
            if (error) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })

            if (resp.rowCount) {
                return res.status(409).send({ status: 409, message: 'User has already been created!' })
            }

            psql.query(query, (err, response) => {
                if (err) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })

                if (response.rowCount) {
                    return res.status(201).send({ status: 201, message: 'success' })
                }
                return res.status(400).send({ status: 400, message: 'No results found!' })
            })
        })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem near ' + e })
    }
})

/** 
 * API POST: Consulta os dados passo no body e fornece um token para acessos aos endpoints
 * 
 * Exemplo: 
 *  {
 *    "user_client": "awade",
 *    "password_client" : "NaoCompreiWEGE3"
 *  }
 */
router.post('/login', (req, res) => {
    try {
        const column = ['user_client', 'password_client']

        column.forEach((e) => {
            if (!req.body[e]) {
                throw new Error(e + ' is required!')
            }
        });

        psql.query('SELECT * FROM ' + table + ' WHERE user_client = $1 ', [req.body.user_client], (error, response) => {
            if (error) return res.status(500).send({ status: 500, message: 'The server detected a problem and was unable to return.' })

            if (response.rowCount) {
                bcrypt.compare(req.body.password_client, response.rows[0].password_client, (berror, result) => {
                    if (result) {
                        const token = jwt.sign({
                            id_client: response.rows[0].id_client,
                            email_client: response.rows[0].email_client,
                        }, process.env.JWT_TOKEN_KEY,
                            {
                                expiresIn: '300s'
                            }
                        )
                        return res.status(202).send({ status: 202, message: 'Authentication success!', data: { token: token } })
                    } else {
                        return res.status(401).send({ status: 401, message: 'Authentication failed!' })
                    }
                });
            } else {
                return res.status(401).send({ status: 401, message: 'Authentication failed!' })
            }
        })
    } catch (e) {
        return res.status(400).send({ status: 400, message: 'There was a problem near ' + e })
    }
})

module.exports = router