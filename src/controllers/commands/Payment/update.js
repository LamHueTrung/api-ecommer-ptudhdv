const Payment = require('../../../models/Payment');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API cập nhật trạng thái thanh toán
 */
class UpdatePaymentController {
    /**
     * Validator cho API cập nhật trạng thái thanh toán
     * 
     * Chức năng: Kiểm tra tính hợp lệ của trạng thái thanh toán.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `status` trong `req.body` và `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { status } = req.body;

        return Validator.validateAll([
            Validator.notEmpty(status, messages.payment.validation.notEmpty('Payment status')),
            Validator.isEnum(status, ['pending', 'completed', 'failed'], messages.payment.validation.invalidStatus('Payment status')),
        ]);
    }

    /**
     * Xử lý API cập nhật trạng thái thanh toán
     * 
     * Chức năng: Cập nhật trạng thái thanh toán trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `status` trong `req.body` và `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin thanh toán đã cập nhật.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của dữ liệu
            const errors = await UpdatePaymentController.validator(req);
            if (errors) {
                logger.warn(`Cập nhật trạng thái thanh toán thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            const { status } = req.body;

            // Cập nhật trạng thái thanh toán
            const payment = await Payment.findByIdAndUpdate(
                id,
                { status },
                { new: true } // Trả về thông tin thanh toán sau khi cập nhật
            );

            if (!payment) {
                logger.warn(`Thanh toán với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.payment.validation.paymentNotFound });
            }

            logger.info(`Trạng thái thanh toán với ID ${id} đã được cập nhật thành công.`);
            return res.status(200).json({
                message: messages.payment.success.paymentUpdated,
                payment,
            });
        } catch (error) {
            logger.error(`Lỗi khi cập nhật trạng thái thanh toán: ${error.message}`);
            return res.status(500).json({
                message: messages.payment.error.updatingPayment,
                error: error.message,
            });
        }
    }
}

module.exports = UpdatePaymentController;
