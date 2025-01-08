const Payment = require('../../../models/Payment');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy danh sách thanh toán
 */
class GetAllPaymentsController {
    /**
     * Xử lý API lấy danh sách thanh toán
     * 
     * Chức năng: Lấy danh sách tất cả các thanh toán từ cơ sở dữ liệu, kèm theo thông tin chi tiết của đơn hàng liên quan.
     * 
     * @param {Object} req - Đối tượng request từ client.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa danh sách thanh toán hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Lấy danh sách thanh toán và populate thông tin liên quan đến đơn hàng
            const payments = await Payment.find()
                .populate('order', 'user totalAmount status'); // Populate thông tin đơn hàng (user, tổng tiền, trạng thái)

            logger.info(`Lấy danh sách ${payments.length} thanh toán thành công.`);
            return res.status(200).json({ payments });
        } catch (error) {
            logger.error(`Lỗi khi lấy danh sách thanh toán: ${error.message}`);
            return res.status(500).json({
                message: messages.payment.error.fetchingPayments,
                error: error.message,
            });
        }
    }
}

module.exports = GetAllPaymentsController;
