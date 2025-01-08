const Order = require('../../../models/Order');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy thông tin đơn hàng theo ID
 */
class GetOrderByIdController {
    /**
     * Validator cho API lấy thông tin đơn hàng
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID đơn hàng.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(id, messages.order.validation.notEmpty('Order ID')),
        ]);
    }

    /**
     * Xử lý API lấy thông tin đơn hàng theo ID
     * 
     * Chức năng: Lấy thông tin chi tiết đơn hàng từ cơ sở dữ liệu dựa trên ID nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông tin đơn hàng hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await GetOrderByIdController.validator(req);
            if (errors) {
                logger.warn(`Lấy thông tin đơn hàng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;

            // Lấy thông tin đơn hàng và populate thông tin liên quan
            const order = await Order.findById(id)
                .populate('user', 'name email') // Lấy thông tin người dùng (name, email)
                .populate('products.product', 'name price'); // Lấy thông tin sản phẩm (name, price)

            if (!order) {
                logger.warn(`Đơn hàng với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.order.validation.orderNotFound });
            }

            logger.info(`Lấy thông tin đơn hàng với ID ${id} thành công.`);
            return res.status(200).json({ order });
        } catch (error) {
            logger.error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
            return res.status(500).json({
                message: messages.order.error.fetchingOrder,
                error: error.message,
            });
        }
    }
}

module.exports = GetOrderByIdController;
