const express = require('express')
const cors = require('cors')
const path = require('path')

const planetsRouter = require('./routes/planets/planets.router')

const app = express()

// middleware
app.use(cors({
    origin: 'http://localhost:3000',
}))
app.use(express.json())
app.use(planetsRouter)
// Afeter adding the front end to out backend folder with the build script in client
// we can serve it directly from our backend using middleware.
app.use(express.static(path.join(__dirname, "..", "public")))

module.exports = app