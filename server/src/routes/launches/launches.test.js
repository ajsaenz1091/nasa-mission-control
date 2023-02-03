const request = require('supertest')
const app = require('../../app')
const { loadLaunchesData } = require('../../models/launches.model')

const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
const { loadPlanetsData } =  require('../../models/planets.model')

describe('Launches ApI', () => {

    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll(async () => {
        await mongoDisconnect();
      });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200)
        })
    })
    
    describe('Test POST /v1/launches', () => {
    
        const testLaunchWithAllProperties = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            destination: 'Kepler-1652 b',
            launchDate: 'January 4, 2028',
        }
    
        const testLaunchWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            destination: 'Kepler-1652 b',
        }
    
        const testLaunchWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            destination: 'Kepler-1652 b',
            launchDate: 'Invalid Date',
        }
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(testLaunchWithAllProperties)
                .expect('Content-Type', /json/)
                .expect(201)
    
            const requestDate = new Date(testLaunchWithAllProperties.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(testLaunchWithoutDate)
        })
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(testLaunchWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            })
        })
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(testLaunchWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
        expect(response.body).toStrictEqual({
            error: "Invalid launch date. Date should follow this format: January 17, 2030"
        })
        })
    })
})

