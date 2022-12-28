const express = require('express')

const { httpGetAllLaunches, httpAddNewLaunch } = require('./launches.controller')


const launchesRouter = express.Router()

// GET Launches
launchesRouter.get('/launches', httpGetAllLaunches)

// POST Launch
launchesRouter.post('/launches', httpAddNewLaunch)

module.exports = launchesRouter