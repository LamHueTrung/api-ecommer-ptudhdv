const Validator = require('../../../utils/validators');
const User = require('../../../models/User');
const messages = require('../../../utils/messages');
const logger = require('../../../config/logger'); // Import logger

/**
 * Controller xử lý API tạo người dùng
 */
class CreateUserController {
    /**
     * Validator cho API tạo người dùng
     * 
     * Chức năng: Kiểm tra tính hợp lệ của dữ liệu người dùng trước khi tạo.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `name`, `email`, `password`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { name, email, password } = req.body;

        try {
            // Kiểm tra nếu email đã tồn tại
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.warn(`Email ${email} đã tồn tại khi tạo người dùng.`);
                return [messages.user.validation.userExists];
            }

            // Kiểm tra các điều kiện khác
            return Validator.validateAll([
                Validator.notEmpty(name, messages.user.validation.notEmpty('Tên người dùng')),
                Validator.isEmail(email, messages.user.validation.isEmail),
                Validator.isPassword(password, messages.user.validation.isPassword),
            ]);
        } catch (error) {
            logger.error(`Lỗi trong quá trình xác thực: ${error.message}`);
            throw error; // Throw để xử lý tại nơi gọi
        }
    }

    /**
     * Xử lý API tạo người dùng
     * 
     * Chức năng: Xử lý logic tạo người dùng mới trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa thông tin `name`, `email`, `password`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo hoặc thông tin người dùng đã tạo.
     */
    static async handle(req, res) {
        try {
            // Gọi validator để kiểm tra dữ liệu
            const errors = await CreateUserController.validator(req);
            if (errors) {
                logger.info(`Tạo người dùng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            // Tạo người dùng mới
            const { name, email, password } = req.body;
            const user = await User.create({ name, email, password });
            logger.info(`Người dùng với email ${email} đã được tạo thành công.`);
            return res.status(201).json({ message: messages.user.success.userCreated, user });
        } catch (error) {
            logger.error(`Lỗi khi tạo người dùng: ${error.message}`);
            return res.status(500).json({ message: messages.user.error.creatingUser, error: error.message });
        }
    }
}

module.exports = CreateUserController;
