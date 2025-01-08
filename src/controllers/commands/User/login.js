const jwt = require('jsonwebtoken');
const User = require('../../../models/User'); // Đường dẫn tới model User
const dotenv = require('dotenv');
dotenv.config();

/**
 * Controller xử lý API đăng nhập
 */
class LoginController {
    /**
     * Xử lý đăng nhập và trả về token
     * @param {Object} req - Request từ client
     * @param {Object} res - Response để gửi kết quả
     */
    static async handle(req, res) {
        const { email, password } = req.body;

        try {
            // Kiểm tra xem user có tồn tại không
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Kiểm tra mật khẩu (giả định là mật khẩu được lưu dạng plain text, cần thay bằng bcrypt trong thực tế)
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Tạo JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error during login:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = LoginController;
