const mongoose = require('../database')

const Schema = mongoose.Schema;

const List = new Schema({
    bot: String,
    name: String,
    data: String
});

const list = mongoose.model('List', List)

const addlist = async function (bot, type, data) {
    try {
        const ret = await list.findOne({ bot: bot, name: type })
        if (ret == null) {
            await list.create(
                {
                    bot: bot,
                    name: type,
                    data: data
                }
            )
        } else {
            await list.updateOne({ bot: bot, name: type }, { data: data })
        }
    } catch (err) {
        console.log(err)
    }
}

const deleteDocuments = async function () {
    try {
        await list.deleteMany({})
    } catch (err) {
        console.log(err)
    }
}

module.exports = { list, addlist, deleteDocuments }