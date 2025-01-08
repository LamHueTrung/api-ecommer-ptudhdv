const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('./logger'); 

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;
