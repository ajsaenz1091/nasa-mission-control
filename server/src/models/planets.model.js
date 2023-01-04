const { parse } = require('csv-parse')
const { createReadStream } = require('fs')
const path = require('path')

const Planet = require('./planets.mongo')

// createReadStream creates an event emitter which we can then listen to using the on() function
// this stream created reads or in other words gives data
const stream = createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))

const parser = parse({
    comment: '#',
    columns: true
  });

// the purpose of this function is to filter out the planets that are habitable
// One of the key pieces of information we have available for extrasolar planets to assess their potential habitability is their effective stellar flux (or Seff where Earth’s value is defined as 1). This can be readily calculated using information about a planet’s orbit and the luminosity of its sun. If this effective stellar flux falls within a range corresponding to the limits of a sun’s habitable zone (HZ), this planet has met one of the basic criteria for potential habitability.
// For an Earth-size planet orbiting a Sun-like star, this limit corresponds to an Seff of about ##### HIGH LIMIT 1.11. ###### The Seff corresponding to this inner limit of the HZ would be slightly higher for planets more massive than the Earth and slightly lower for stars cooler than the Sun.

// So basically, the habitable range is from 0.36 to 1.11 of stellar flux

// A series of analyses of Kepler data and follow-up observations published over the last year have shown that there are limits on how large a rocky planet can become before it starts to possess increasingly large amounts of water, hydrogen and helium as well as other volatiles making the planet a Neptune-like world with no real prospect of being habitable. Work performed by Leslie Rogers (a Hubble Fellow at the California Institute of Technology) has shown that planets with radii greater than no more than 1.6 times that of the Earth (or RE) are most likely mini-Neptunes. This and other recent work suggests that this transition corresponds to planets with masses greater than about 4 to 6 times that of the Earth (or ME). As a result, planets larger or more massive than these empirically-derived thresholds are unlikely to be rocky planets never mind habitable.

function isHabitablePlanet(planet) {
    // the 'koi_disposition' is what tells us if the planet has been confirmed
    // the stellar flux('koi_insol') defines the habitability of the planet eff < 0.36 (too cold) eff > 1.11(too hot) everything in between (habitable) 
    // the planetary radius('koi_prad') also helps predict habitability and it should be 1.6 smaller than that of earth
    return planet['koi_disposition'] === 'CONFIRMED' && (planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11) && planet['koi_prad'] < 1.6
}

// Use pormises to handle asynchornous behaviour. The parser should finish before any request is sent to get planets.
function loadPlanetsData() {
    // using the pipe function, we can connect the stream that gives data (stream) with the one that takes/writes it (parser)
    return new Promise((resolve, reject) => {
        stream.pipe(parser)
        .on('data', async data => {
            if (isHabitablePlanet(data)){
                savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err)
            reject(err)
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`${countPlanetsFound} habitable planets found!`)
            resolve();
        })
    })
        
}

async function getAllPlanets() {
    return await Planet.find({})
}

async function  savePlanet(planet) {

    try {
        // insert + update = upsert
        // The upsert makes sure that a planet is only created once(only if it does not already exists)
        await Planet.updateOne({
            keplerName: planet.kepler_name
        }, { 
            keplerName: planet.kepler_name 
        }, {
            upsert: true,
        })
    } catch(err) {
        console.log(`Could not save planet ${err}`)
    }
    
}


module.exports = {
    loadPlanetsData,
    getAllPlanets: getAllPlanets,
}