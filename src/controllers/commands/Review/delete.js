const Review = require('../../../models/Review');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API xóa đánh giá
 */
class DeleteReviewController {
    /**
     * Validator cho API xóa đánh giá
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID đánh giá.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(id, messages.review.validation.notEmpty('Review ID')),
        ]);
    }

    /**
     * Xử lý API xóa đánh giá
     * 
     * Chức năng: Xóa đánh giá khỏi cơ sở dữ liệu dựa trên ID nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo thành công hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await DeleteReviewController.validator(req);
            if (errors) {
                logger.warn(`Xóa đánh giá thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { id } = req.params;

            // Xóa đánh giá
            const review = await Review.findByIdAndDelete(id);

            if (!review) {
                logger.warn(`Đánh giá với ID ${id} không tồn tại.`);
                return res.status(404).json({ message: messages.review.validation.reviewNotFound });
            }

            logger.info(`Đánh giá với ID ${id} đã được xóa thành công.`);
            return res.status(200).json({ message: messages.review.success.reviewDeleted });
        } catch (error) {
            logger.error(`Lỗi khi xóa đánh giá: ${error.message}`);
            return res.status(500).json({
                message: messages.review.error.deletingReview,
                error: error.message,
            });
        }
    }
}

module.exports = DeleteReviewController;
