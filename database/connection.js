const mongoose = require('mongoose');
async function connectDb() {
    if (mongoose.connection.readyState) {
        console.log('Already connected to database');
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI environment variable is not defined');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

module.exports = connectDb;
