const Validator = require('../../../utils/validators');
const Order = require('../../../models/Order');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API cập nhật đơn hàng
 */
class UpdateOrderController {
    /**
     * Validator cho API cập nhật đơn hàng
     * 
     * Chức năng: Kiểm tra ID hợp lệ, kiểm tra nếu đơn hàng tồn tại, và xác thực dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `products`, `totalAmount` trong `req.body` và `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;
        const { products, totalAmount } = req.body;

        try {
            // Kiểm tra nếu ID không được cung cấp
            const idError = Validator.notEmpty(id, messages.order.validation.notEmpty('Order ID'));
            if (idError) return [idError];

            // Kiểm tra nếu đơn hàng tồn tại
            const existingOrder = await Order.findById(id);
            if (!existingOrder) {
                return [messages.order.validation.orderNotFound];
            }

            // Kiểm tra các trường dữ liệu đầu vào
            return Validator.validateAll([
                products && Validator.arrayNotEmpty(products, messages.order.validation.notEmpty('Products')),
                totalAmount && Validator.isPositiveNumber(totalAmount, messages.order.validation.isPositiveNumber('Total Amount')),
            ]);
        } catch (error) {
            logger.error(`Lỗi trong quá trình xác thực dữ liệu: ${error.message}`);
            throw error;
        }
    }

    /**
     * Xử lý API cập nhật đơn hàng
     * 
     * Chức năng: Cập nhật đơn hàng trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `products`, `totalAmount` trong `req.body` và `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin đơn hàng đã cập nhật.
     */
    static async handle(req, res) {
        try {
            const errors = await UpdateOrderController.validator(req);
            if (errors) {
                logger.warn(`Cập nhật đơn hàng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            const { products, totalAmount } = req.body;

            // Cập nhật đơn hàng với các trường dữ liệu được cung cấp
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                {
                    ...(products && { products }), // Cập nhật products nếu được gửi
                    ...(totalAmount && { totalAmount }), // Cập nhật totalAmount nếu được gửi
                },
                { new: true } // Trả về đơn hàng sau khi cập nhật
            );

            if (!updatedOrder) {
                logger.warn(`Không tìm thấy đơn hàng với ID ${id} để cập nhật.`);
                return res.status(404).json({ message: messages.order.validation.orderNotFound });
            }

            logger.info(`Đơn hàng với ID ${id} đã được cập nhật thành công.`);
            return res.status(200).json({
                message: messages.order.success.orderUpdated,
                order: updatedOrder,
            });
        } catch (error) {
            logger.error(`Lỗi khi cập nhật đơn hàng: ${error.message}`);
            return res.status(500).json({
                message: messages.order.error.updatingOrder,
                error: error.message,
            });
        }
    }
}

module.exports = UpdateOrderController;
