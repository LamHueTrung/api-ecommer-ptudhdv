const Review = require('../../../models/Review');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API tạo đánh giá
 */
class CreateReviewController {
    /**
     * Validator cho API tạo đánh giá
     * 
     * Chức năng: Kiểm tra tính hợp lệ của các trường dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `product`, `rating`, `comment` trong `req.body`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { product, rating, comment } = req.body;

        return Validator.validateAll([
            Validator.notEmpty(product, messages.review.validation.notEmpty('Product ID')),
            Validator.isPositiveNumber(rating, messages.review.validation.isPositiveNumber('Rating')),
            Validator.maxLength(comment, 500, messages.review.validation.maxLength('Comment', 500)),
        ]);
    }

    /**
     * Xử lý API tạo đánh giá
     * 
     * Chức năng: Tạo đánh giá mới trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa thông tin đánh giá trong `req.body` và `user.id` từ JWT middleware.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin đánh giá đã tạo.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của dữ liệu
            const errors = await CreateReviewController.validator(req);
            if (errors) {
                logger.warn(`Tạo đánh giá thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { product, rating, comment } = req.body;
            const userId = req.user.id;

            // Tạo đánh giá mới
            const review = await Review.create({
                user: userId,
                product,
                rating,
                comment,
            });

            logger.info(`Đánh giá mới đã được tạo cho sản phẩm: ${product}`);
            return res.status(201).json({
                message: messages.review.success.reviewCreated,
                review,
            });
        } catch (error) {
            logger.error(`Lỗi khi tạo đánh giá: ${error.message}`);
            return res.status(500).json({
                message: messages.review.error.creatingReview,
                error: error.message,
            });
        }
    }
}

module.exports = CreateReviewController;
