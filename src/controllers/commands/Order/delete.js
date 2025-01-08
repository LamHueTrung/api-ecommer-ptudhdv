const Order = require('../../../models/Order');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API xóa đơn hàng
 */
class DeleteOrderController {
    /**
     * Validator cho API xóa đơn hàng
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID đơn hàng.
     * 
     * @param {Object} req - Đối tượng request từ client.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(id, messages.order.validation.notEmpty('Order ID')),
        ]);
    }

    /**
     * Xử lý API xóa đơn hàng
     * 
     * @param {Object} req - Đối tượng request từ client.
     * @param {Object} res - Đối tượng response để gửi phản hồi.
     */
    static async handle(req, res) {
        try {
            const errors = await DeleteOrderController.validator(req);
            if (errors) {
                logger.warn(`Xóa đơn hàng thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            const order = await Order.findByIdAndDelete(id);

            if (!order) {
                logger.warn(`Đơn hàng với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.order.validation.orderNotFound });
            }

            logger.info(`Đơn hàng với ID ${id} đã được xóa thành công.`);
            return res.status(200).json({ message: messages.order.success.orderDeleted });
        } catch (error) {
            logger.error(`Lỗi khi xóa đơn hàng: ${error.message}`);
            return res.status(500).json({
                message: messages.order.error.deletingOrder,
                error: error.message,
            });
        }
    }
}

module.exports = DeleteOrderController;
