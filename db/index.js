
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    mongoose.connect(process.env.mongoDbUrl)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

}

module.exports = { dbConnection };