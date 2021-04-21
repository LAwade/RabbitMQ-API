const mongoose = require('mongoose')

mongoose.connect('mongodb://awade:Hunt3r195@localhost:27017/tibiabot?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose