const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect("mongodb://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWD + "@" + process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/" + process.env.MONGODB_CLUSTER + "?authSource=" + process.env.MONGODB_AUTHSOURCE, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose