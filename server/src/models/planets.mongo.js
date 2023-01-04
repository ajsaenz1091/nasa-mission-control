const mongoose = require('mongoose')
const { Schema, model } = mongoose

const planetSchema = new Schema({
    keplerName: {
        type: String,
        required: true,
    }
})

const Planet = mongoose.model('Planet', planetSchema)

module.exports = Planet