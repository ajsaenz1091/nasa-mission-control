const { getAllLaunches, existsLaunchWithId, addNewLaunch, abortLaunch } = require('../../models/launches.model')

// GET Launches
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

// POST Launch
function httpAddNewLaunch(req, res) {
    const launch = req.body
    // Manual validation for missing properties in request body
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({
            error: 'Missing required launch property',
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    // Date validation, isNaN converts date types to a number so the return value is "false" meaning that the date was successfully parsed and the code block should not execute
    // On the other hand, any value that is not a date, will return NaN, meaning that the date was not successfully parsed and an error should be returned.
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: `Invalid launch date. Date should follow this format: January 17, 2030`
        })
    }

    addNewLaunch(launch)

    return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = abortLaunch(launchId)

    return res.status(200).json(aborted)
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}