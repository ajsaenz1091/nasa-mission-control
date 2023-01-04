const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')

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

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
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
        await Launch.updateOne({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        })
    } catch(err) {
        console.log(`Could not save launch ${err}`)
    }
}

// GET
async function getAllLaunches() {
    return await Launch.find({},{
        '_id': 0, '__v': 0,
    })
}

// POST
function addNewLaunch(launch) {
    latestFlightNumber++
    
    Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customer: ['NASA', 'NOOA'],
        upcoming: true,
        success: true,
    })

    launches.set(launch.flightNumber, launch)
}

// DELETE
function abortLaunch(launchId) {
    aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false

    return aborted
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId,
}