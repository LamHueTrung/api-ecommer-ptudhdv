const Validator = require('../../../utils/validators');
const User = require('../../../models/User');
const messages = require('../../../utils/messages');
const logger = require('../../../config/logger'); // Sử dụng logger để ghi log

/**
 * Controller xử lý API xóa người dùng
 */
class DeleteUserController {
    /**
     * Validator cho API xóa người dùng
     * 
     * Chức năng: Kiểm tra tính hợp lệ của dữ liệu đầu vào, bao gồm việc xác minh ID và kiểm tra sự tồn tại của người dùng.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        // Kiểm tra nếu ID không được cung cấp
        const errors = Validator.validateAll([Validator.notEmpty(id, messages.user.validation.notEmpty('User ID'))]);
        if (errors) return errors;

        // Kiểm tra người dùng có tồn tại không
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return [messages.user.validation.userNotFound];
        }

        return null; // Không có lỗi
    }

    /**
     * Xử lý API xóa người dùng
     * 
     * Chức năng: Xóa người dùng khỏi cơ sở dữ liệu nếu người dùng tồn tại và không có lỗi xác thực.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo thành công hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Gọi validator để kiểm tra dữ liệu
            const errors = await DeleteUserController.validator(req);
            if (errors) {
                logger.warn(`Xóa người dùng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const userId = req.params.id;

            // Xóa người dùng
            await User.findByIdAndDelete(userId);

            logger.info(`Người dùng với ID ${userId} đã được xóa thành công.`);
            return res.status(200).json({ message: messages.user.success.userDeleted });
        } catch (error) {
            logger.error(`Lỗi khi xóa người dùng: ${error.message}`);
            return res.status(500).json({ message: messages.user.error.deletingUser, error: error.message });
        }
    }
}

module.exports = DeleteUserController;
