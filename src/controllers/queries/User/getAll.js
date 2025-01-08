const User = require('../../../models/User');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy danh sách người dùng
 */
class GetAllUsersController {
    /**
     * Validator cho API lấy danh sách người dùng
     * 
     * Chức năng: Không cần kiểm tra dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client.
     * @returns {null} - Không có lỗi.
     */
    static async validator(req) {
        return null;
    }

    /**
     * Xử lý API lấy danh sách người dùng
     * 
     * Chức năng: Trả về danh sách người dùng với các tùy chọn tìm kiếm, sắp xếp và phân trang.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa các query params: `page`, `limit`, `sort`, `order`, `search`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa danh sách người dùng, tổng số, trang hiện tại và giới hạn.
     */
    static async handle(req, res) {
        try {
            const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search } = req.query;

            const filter = {};
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sortOptions = { [sort]: order === 'desc' ? -1 : 1 };

            const users = await User.find(filter).sort(sortOptions).skip(skip).limit(parseInt(limit));
            const totalUsers = await User.countDocuments(filter);

            logger.info(`Fetched ${users.length} users (page: ${page}, limit: ${limit})`);
            return res.status(200).json({
                users,
                total: totalUsers,
                page: parseInt(page),
                limit: parseInt(limit),
            });
        } catch (error) {
            logger.error(`Error fetching users: ${error.message}`);
            return res.status(500).json({ message: messages.user.error.fetchingUsers, error: error.message });
        }
    }
}

module.exports = GetAllUsersController;
