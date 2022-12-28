const express = require('express')

const { httpGetAllLaunches, httpPostLaunch } = require('./launches.controller')


const launchesRouter = express.Router()

// GET Launches
launchesRouter.get('/launches', httpGetAllLaunches)

// POST Launch
launchesRouter.post('/launches', httpPostLaunch)

module.exports = launchesRouter