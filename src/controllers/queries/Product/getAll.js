const Product = require('../../../models/Product');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy danh sách sản phẩm
 */
class GetAllProductsController {
    /**
     * Xử lý API lấy danh sách sản phẩm
     * 
     * Chức năng: Lấy danh sách tất cả các sản phẩm từ cơ sở dữ liệu với tùy chọn phân trang, tìm kiếm, và sắp xếp.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa các tham số truy vấn (`page`, `limit`, `search`, `sort`, `order`).
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa danh sách sản phẩm hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            const { page = 1, limit = 10, search = '', sort = 'name', order = 'asc' } = req.query;

            // Tạo bộ lọc tìm kiếm
            const filter = {};
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }

            // Phân trang
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Sắp xếp
            const sortOptions = {};
            sortOptions[sort] = order === 'desc' ? -1 : 1;

            // Lấy danh sách sản phẩm
            const products = await Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            // Tổng số sản phẩm (phục vụ phân trang)
            const totalProducts = await Product.countDocuments(filter);

            logger.info(`Lấy danh sách ${products.length} sản phẩm (trang ${page}) thành công.`);
            return res.status(200).json({
                products,
                total: totalProducts,
                page: parseInt(page),
                limit: parseInt(limit),
            });
        } catch (error) {
            logger.error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
            return res.status(500).json({
                message: messages.product.error.fetchingProducts,
                error: error.message,
            });
        }
    }
}

module.exports = GetAllProductsController;
