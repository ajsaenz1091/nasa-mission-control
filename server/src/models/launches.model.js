const axios = require('axios')

const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name in response from axios request 
    launchDate: new Date('December 27, 2030'), // date_local
    destination: 'Kepler-442 b', // N/A
    customers: ['NASA', 'NOOA'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
}



saveNewLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
const LAUNCHES_REQ_BODY = {
    query: {},
    options: {
        populate: [
            {
                path: 'rocket',
                select: {
                    name: 1
                }
            },
            {
                path: payloads,
                select: {
                    customers: 1
                }
            }
        ]
    }
}

async function loadLaunchesData() {
    const response = await axios.post(SPACEX_API_URL, LAUNCHES_REQ_BODY)
}

async function existsLaunchWithId(launchId) {
    return await Launch.findOne({ flightNumber: launchId })
}

async function saveNewLaunch(launch) {
    // planet validation to make sure the planet on the new launch actually exists in the planets collection
    const planet = await Planet.findOne({keplerName: launch.destination}, {
        '_id':0, '__v': 0
    })
    
    if (!planet) {
        throw new Error('No matching planet found')
    }

    try {
        // insert + update = upsert
        // The upsert makes sure that a planet is only created once(only if it does not already exists)
        await Launch.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        })
    } catch(err) {
        console.log(`Could not save launch ${err}`)
    }
}

// getLatestFlightNumber will help us with incrementing the flightNumber every time we create a new Launch
async function getLatestFlightNumber() {
    const latestLaunch = await Launch
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

// GET
async function getAllLaunches() {
    return await Launch.find({},{
        '_id': 0, '__v': 0,
    })
}

// POST

async function scheduleNewLaunch(launch) {
    const latestFlightNumber = await getLatestFlightNumber() + 1

    const newLauch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['NASA', 'NOOA'],
        upcoming: true,
        success: true,
    })

    saveNewLaunch(newLauch)
}

// DELETE

async function abortLaunch(launchId) {
    const filter = { flightNumber: launchId }

    const update = {
        upcoming: false,
        success: false,
    }

    const aborted = await Launch.updateOne(filter, update )

    return aborted.acknowledged == true && aborted.modifiedCount == 1
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch,
    existsLaunchWithId,
}