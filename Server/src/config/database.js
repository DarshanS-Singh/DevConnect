
const mongoose = require('mongoose')


const ConnectDB = async () => {
    const uri = process.env.MONGODB_URI || "mongodb+srv://akshitpjt07:akiop1114@cluster0.zwuzzvp.mongodb.net/devTinder"
    mongoose.connection.on('connected', () => {
        console.log('DB connected')
    })
    mongoose.connection.on('error', (err) => {
        console.error('DB connection error', err && err.message ? err.message : err)
    })
    return mongoose.connect(uri)
}



module.exports = ConnectDB
