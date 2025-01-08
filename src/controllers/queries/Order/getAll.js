const Order = require('../../../models/Order');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy danh sách đơn hàng
 */
class GetAllOrdersController {
    /**
     * Xử lý API lấy danh sách đơn hàng
     * 
     * Chức năng: Lấy danh sách tất cả các đơn hàng từ cơ sở dữ liệu, kèm theo thông tin chi tiết của người dùng và sản phẩm.
     * 
     * @param {Object} req - Đối tượng request từ client.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa danh sách đơn hàng hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Lấy danh sách đơn hàng và populate thông tin user và sản phẩm
            const orders = await Order.find()
                .populate('user', 'name email') // Lấy thông tin người dùng (name, email)
                .populate('products.product', 'name price'); // Lấy thông tin sản phẩm (name, price)

            logger.info(`Lấy danh sách ${orders.length} đơn hàng thành công.`);
            return res.status(200).json({ orders });
        } catch (error) {
            logger.error(`Lỗi khi lấy danh sách đơn hàng: ${error.message}`);
            return res.status(500).json({
                message: messages.order.error.fetchingOrders,
                error: error.message,
            });
        }
    }
}

module.exports = GetAllOrdersController;
