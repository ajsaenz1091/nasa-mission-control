const mongoose = require('mongoose')
const { Schema, model } = mongoose

const launchSchema = new Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    destination: {
        type: String,
        ref: 'Planet',
    },
    customers: [ String ],
    upcoming: {
        type : Boolean,
        required: true,
    },
    success: {
        type : Boolean,
        required: true,
        default: true,
    }
})

// Connects launches schema with launches collection
const Launch = mongoose.model('Launch', launchSchema)

module.exports = Launch