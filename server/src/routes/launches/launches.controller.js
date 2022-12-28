const { getAllLaunches, getLaunch, addNewLaunch } = require('../../models/launches.model')

// GET Launches
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

// GET Launch

// POST Launch
function httpPostLaunch(req, res) {
    const launch = req.body
    return res.status(200).json(addNewLaunch(launch))
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
}