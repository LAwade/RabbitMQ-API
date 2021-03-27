const { Pool } = require('pg')

module.exports = { 
    pool : new Pool({
        user: 'aplication',
        password: 'Tr4d3rB1n4r10',
        database: 'music',
        host: '191.252.218.249',
        port: '5432',
    })
 }