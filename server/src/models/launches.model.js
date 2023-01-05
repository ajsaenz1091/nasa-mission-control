const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    customers: ['NASA', 'NOOA'],
    upcoming: true,
    success: true,
}

saveNewLaunch(launch)

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
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch,
    existsLaunchWithId,
}