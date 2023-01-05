const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:MBQlMqLxWt17ss3j@nasacluster.cyumuee.mongodb.net/nasa?retryWrites=true&w=majority'



mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})

mongoose.set('strictQuery', true)

async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

// async function mongoDisconnect() {
//     await mongoose.disconnect()
// }

module.exports = {
    mongoConnect,
}