const { getAllLaunches, existsLaunchWithId, scheduleNewLaunch, abortLaunch } = require('../../models/launches.model')

const { getPagination } = require('../../services/query')

// GET Launches
async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)

    return res.status(200).json(launches)
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

    scheduleNewLaunch(launch)

    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    const existsLaunch  = await existsLaunchWithId(launchId)

    if (!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = await abortLaunch(launchId)

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }

    return res.status(200).json({ acknowledged: true })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}