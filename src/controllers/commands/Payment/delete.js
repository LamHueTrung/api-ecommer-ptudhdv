const Payment = require('../../../models/Payment');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API xóa thanh toán
 */
class DeletePaymentController {
    /**
     * Validator cho API xóa thanh toán
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID thanh toán.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(id, messages.payment.validation.notEmpty('Payment ID')),
        ]);
    }

    /**
     * Xử lý API xóa thanh toán
     * 
     * Chức năng: Xóa thanh toán khỏi cơ sở dữ liệu dựa trên ID nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo thành công hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await DeletePaymentController.validator(req);
            if (errors) {
                logger.warn(`Xóa thanh toán thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;

            // Xóa thanh toán
            const payment = await Payment.findByIdAndDelete(id);

            if (!payment) {
                logger.warn(`Thanh toán với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.payment.validation.paymentNotFound });
            }

            logger.info(`Thanh toán với ID ${id} đã được xóa thành công.`);
            return res.status(200).json({ message: messages.payment.success.paymentDeleted });
        } catch (error) {
            logger.error(`Lỗi khi xóa thanh toán: ${error.message}`);
            return res.status(500).json({
                message: messages.payment.error.deletingPayment,
                error: error.message,
            });
        }
    }
}

module.exports = DeletePaymentController;
