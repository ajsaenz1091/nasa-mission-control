const { getAllLaunches, getLaunch, addNewLaunch } = require('../../models/launches.model')

// GET Launches
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

// GET Launch

// POST Launch
function httpAddNewLaunch(req, res) {
    const launch = req.body
    launch.launchDate = new Date(launch.launchDate)
    return res.status(200).json(addNewLaunch(launch))
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
}