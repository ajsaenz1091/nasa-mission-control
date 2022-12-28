const express = require('express')

const { httpGetAllLaunches, httpAddNewLaunch } = require('./launches.controller')


const launchesRouter = express.Router()

// GET Launches
launchesRouter.get('/', httpGetAllLaunches)

// POST Launch
launchesRouter.post('/', httpAddNewLaunch)

module.exports = launchesRouter