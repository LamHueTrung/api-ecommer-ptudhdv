const Payment = require('../../../models/Payment');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy thông tin thanh toán theo ID
 */
class GetPaymentByIdController {
    /**
     * Validator cho API lấy thông tin thanh toán
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
     * Xử lý API lấy thông tin thanh toán theo ID
     * 
     * Chức năng: Lấy thông tin chi tiết thanh toán từ cơ sở dữ liệu dựa trên ID nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông tin thanh toán hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await GetPaymentByIdController.validator(req);
            if (errors) {
                logger.warn(`Lấy thông tin thanh toán thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;

            // Lấy thông tin thanh toán và populate thông tin liên quan đến đơn hàng
            const payment = await Payment.findById(id)
                .populate('order', 'user totalAmount status'); // Populate thông tin đơn hàng (user, tổng tiền, trạng thái)

            if (!payment) {
                logger.warn(`Thanh toán với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.payment.validation.paymentNotFound });
            }

            logger.info(`Lấy thông tin thanh toán với ID ${id} thành công.`);
            return res.status(200).json({ payment });
        } catch (error) {
            logger.error(`Lỗi khi lấy thông tin thanh toán: ${error.message}`);
            return res.status(500).json({
                message: messages.payment.error.fetchingPayment,
                error: error.message,
            });
        }
    }
}

module.exports = GetPaymentByIdController;
