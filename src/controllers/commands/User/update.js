const Validator = require('../../../utils/validators');
const User = require('../../../models/User');
const messages = require('../../../utils/messages');
const logger = require('../../../config/logger');

/**
 * Controller xử lý API cập nhật người dùng
 */
class UpdateUserController {
    /**
     * Validator cho API cập nhật người dùng
     * 
     * Chức năng: Kiểm tra dữ liệu đầu vào để đảm bảo người dùng tồn tại và không có xung đột về email.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params` và thông tin cập nhật trong `req.body`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { email } = req.body;

        try {
            // Kiểm tra nếu người dùng tồn tại
            const userId = req.params.id;
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return [messages.user.validation.userNotFound];
            }

            // Kiểm tra email mới có bị trùng không
            if (email) {
                const emailExists = await User.findOne({ email, _id: { $ne: userId } });
                if (emailExists) {
                    return [messages.user.validation.emailExists];
                }
            }

            return null; // Không có lỗi
        } catch (error) {
            logger.error(`Lỗi trong quá trình xác thực: ${error.message}`);
            throw error;
        }
    }

    /**
     * Xử lý API cập nhật người dùng
     * 
     * Chức năng: Cập nhật thông tin người dùng dựa trên dữ liệu đầu vào, giữ nguyên giá trị cũ nếu trường đó không được gửi.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params` và thông tin cập nhật trong `req.body`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo thành công hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Gọi validator để kiểm tra dữ liệu
            const errors = await UpdateUserController.validator(req);
            if (errors) {
                logger.warn(`Cập nhật người dùng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const userId = req.params.id;
            const { name, email, password } = req.body;

            // Lấy thông tin người dùng cũ
            const existingUser = await User.findById(userId);

            // Cập nhật các trường, giữ giá trị cũ nếu không được gửi
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    name: name ?? existingUser.name,
                    email: email ?? existingUser.email,
                    password: password ?? existingUser.password,
                },
                { new: true } // Trả về người dùng sau khi cập nhật
            );

            logger.info(`Người dùng với ID ${userId} đã được cập nhật thành công.`);
            return res.status(200).json({
                message: messages.user.success.userUpdated,
                user: updatedUser,
            });
        } catch (error) {
            logger.error(`Lỗi khi cập nhật người dùng: ${error.message}`);
            return res.status(500).json({ message: messages.user.error.updatingUser, error: error.message });
        }
    }
}

module.exports = UpdateUserController;
