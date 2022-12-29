const express = require('express')

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller')


const launchesRouter = express.Router()

// GET Launches
launchesRouter.get('/', httpGetAllLaunches)

// POST Launch
launchesRouter.post('/', httpAddNewLaunch)

// DELETE Launch 
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter