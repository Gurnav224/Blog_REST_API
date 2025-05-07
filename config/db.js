const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI,{dbName:'blog_db'});
        console.log('successfully connected to database')
    } catch (error) {
        console.error('database connection failure')
    }
}

module.exports = connectDB;