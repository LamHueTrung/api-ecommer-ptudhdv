const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Đảm bảo thư mục 'logs' tồn tại
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Định dạng log
const loggerFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Tạo logger
const logger = createLogger({
    level: 'info',
    format: loggerFormat,
    transports: [
        new transports.File({ filename: path.join(logDirectory, 'app.log'), level: 'info' }),
        new transports.Console() // Hiển thị log trong console
    ]
});

module.exports = logger;
