const bodyparser = require('body-parser')
const express = require('express')
const app = express()

/** Definicoes de Variaveis de Rotas */
const routerQueue = require('./routers/queue')
const routerList = require('./routers/list')

/** Tratamento de dados */
app.use(bodyparser.urlencoded({ extended: false}))
app.use(bodyparser.json())

/** Controla os acessos a API e os metodos que serao permitidos */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method === 'OPTION'){
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE')
        res.status(200).send({})
    }
    next()
})

/** Rota para acesso os metodos */
app.use('/queue', routerQueue)
app.use('/list', routerList)

/** Validacao rotas de erro */
app.use((req, res, next) => {
    const error = new Error('service not found!')
    error.status = 404
    next(error)
})

/** Captura de mesagens e retorno para visualizacao do erro */
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        status: error.status,
        message : error.message
    })
})

module.exports = app