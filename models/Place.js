const { Schema, model } = require('mongoose')


const schema = Schema({
    isAdaptive: {
        type: Boolean,
        default: false
    },
    hasRamps: {
        type: Boolean,
        default: false
    },
    hasTactileCover: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model("Place", schema)