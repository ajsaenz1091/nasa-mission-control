const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

const app = express()

// middleware
app.use(cors({
    origin: 'http://localhost:3000',
}))

// using a request logger to log information about the requests
app.use(morgan('combined'))

app.use(express.json())
// Afeter adding the front end to out backend folder with the build script in client
// we can serve it directly from our backend using middleware.
app.use(express.static(path.join(__dirname, "..", "public")))

app.use('/planets', planetsRouter)
app.use('/launches',launchesRouter)
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app