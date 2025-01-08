const Payment = require('../../../models/Payment');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API tạo thanh toán
 */
class CreatePaymentController {
    /**
     * Validator cho API tạo thanh toán
     * 
     * Chức năng: Kiểm tra tính hợp lệ của các trường dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `order`, `amount`, `method`, `transactionId` trong `req.body`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { order, amount, method } = req.body;

        return Validator.validateAll([
            Validator.notEmpty(order, messages.payment.validation.notEmpty('Order ID')),
            Validator.isPositiveNumber(amount, messages.payment.validation.isPositiveNumber('Payment amount')),
            Validator.isEnum(method, ['cash', 'card'], messages.payment.validation.invalidMethod('Payment method')),
        ]);
    }

    /**
     * Xử lý API tạo thanh toán
     * 
     * Chức năng: Tạo một giao dịch thanh toán mới nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa thông tin thanh toán trong `req.body`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin thanh toán đã tạo.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của dữ liệu
            const errors = await CreatePaymentController.validator(req);
            if (errors) {
                logger.warn(`Tạo thanh toán thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { order, amount, method, transactionId } = req.body;

            // Tạo thanh toán mới
            const payment = await Payment.create({
                order,
                amount,
                method,
                transactionId,
            });

            logger.info(`Thanh toán mới đã được tạo thành công cho đơn hàng: ${order}`);
            return res.status(201).json({
                message: messages.payment.success.paymentCreated,
                payment,
            });
        } catch (error) {
            logger.error(`Lỗi khi tạo thanh toán: ${error.message}`);
            return res.status(500).json({
                message: messages.payment.error.creatingPayment,
                error: error.message,
            });
        }
    }
}

module.exports = CreatePaymentController;
