const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const connectDB = require('./config/db'); // Kết nối MongoDB
const apiRoutes = require('./routes/index'); // Import router tổng
const setupSwagger = require('./config/swagger');
// Kết nối cơ sở dữ liệu
connectDB();

// Middleware để đọc JSON từ body request
app.use(express.json());
setupSwagger(app);          
// Định tuyến API
app.use(apiRoutes);
// Middleware xử lý lỗi không tìm thấy
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Middleware xử lý lỗi server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
