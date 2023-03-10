const http =  require('http')

require('dotenv').config()

const app = require('./app')
const { mongoConnect } = require('./services/mongo')
const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchesData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

// We want the planets to be loaded before any request is made to the server so we use await
async function startServer() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchesData()

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
}

startServer()
