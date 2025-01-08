const Review = require('../../../models/Review');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy danh sách đánh giá sản phẩm
 */
class GetAllReviewsController {
    /**
     * Validator cho API lấy danh sách đánh giá
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID sản phẩm.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `productId` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { productId } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(productId, messages.review.validation.notEmpty('Product ID')),
        ]);
    }

    /**
     * Xử lý API lấy danh sách đánh giá sản phẩm
     * 
     * Chức năng: Lấy danh sách đánh giá từ cơ sở dữ liệu dựa trên `productId` nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `productId` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa danh sách đánh giá hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của productId
            const errors = await GetAllReviewsController.validator(req);
            if (errors) {
                logger.warn(`Lấy danh sách đánh giá thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { productId } = req.params;

            // Lấy danh sách đánh giá cho sản phẩm và populate thông tin người dùng
            const reviews = await Review.find({ product: productId }).populate('user', 'name email');

            logger.info(`Lấy danh sách ${reviews.length} đánh giá cho sản phẩm ${productId} thành công.`);
            return res.status(200).json({ reviews });
        } catch (error) {
            logger.error(`Lỗi khi lấy danh sách đánh giá: ${error.message}`);
            return res.status(500).json({
                message: messages.review.error.fetchingReviews,
                error: error.message,
            });
        }
    }
}

module.exports = GetAllReviewsController;
