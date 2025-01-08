const Validator = require('../../../utils/validators');
const User = require('../../../models/User');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy thông tin người dùng theo ID
 */
class GetUserByIdController {
    /**
     * Validator cho API lấy thông tin người dùng theo ID
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID người dùng.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;
        return Validator.validateAll([Validator.notEmpty(id, messages.user.validation.notEmpty('User ID'))]);
    }

    /**
     * Xử lý API lấy thông tin người dùng theo ID
     * 
     * Chức năng: Trả về thông tin chi tiết của người dùng theo ID, hoặc thông báo lỗi nếu không tìm thấy.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông tin người dùng hoặc thông báo lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await GetUserByIdController.validator(req);
            if (errors) {
                logger.warn(`Lấy thông tin người dùng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                logger.warn(`Người dùng với ID ${userId} không tồn tại.`);
                return res.status(404).json({ message: messages.user.validation.userNotFound });
            }

            logger.info(`Thông tin người dùng với ID ${userId} đã được trả về.`);
            return res.status(200).json({ user });
        } catch (error) {
            logger.error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
            return res.status(500).json({ message: messages.user.error.fetchingUser, error: error.message });
        }
    }
}

module.exports = GetUserByIdController;
