const launches = new Map()

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    customer: ['NASA', 'NOOA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch)
// access launches using get

// GET
function getAllLaunches(){
    return Array.from(launches.values())
}

function getLaunch(flightNumber) {
    return launches.get(flightNumber)
}

// POST
function addNewLaunch(launch) {
    launches.set(launch.flightNumber, launch)
    return launches.get(launch.flightNumber)
}


module.exports = {
    getAllLaunches,
    getLaunch,
    addNewLaunch,
}