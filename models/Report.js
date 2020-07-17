const { Schema, model } = require('mongoose')


const schema = Schema({
    body: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    reportImage: {
        type: String,
        required: true,
    },
})

module.exports = model("Report", schema)