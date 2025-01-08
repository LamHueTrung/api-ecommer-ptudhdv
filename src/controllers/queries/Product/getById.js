const Product = require('../../../models/Product');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API lấy thông tin sản phẩm theo ID
 */
class GetProductByIdController {
    /**
     * Validator cho API lấy thông tin sản phẩm
     * 
     * Chức năng: Kiểm tra tính hợp lệ của ID sản phẩm.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { id } = req.params;

        return Validator.validateAll([
            Validator.notEmpty(id, messages.product.validation.notEmpty('Product ID')),
        ]);
    }

    /**
     * Xử lý API lấy thông tin sản phẩm theo ID
     * 
     * Chức năng: Lấy thông tin chi tiết sản phẩm từ cơ sở dữ liệu dựa trên ID nếu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `id` trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông tin sản phẩm hoặc lỗi.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của ID
            const errors = await GetProductByIdController.validator(req);
            if (errors) {
                logger.warn(`Lấy thông tin sản phẩm thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const productId = req.params.id;

            // Lấy thông tin sản phẩm
            const product = await Product.findById(productId);

            if (!product) {
                logger.warn(`Sản phẩm với ID ${productId} không tồn tại.`);
                return res.status(404).json({ message: messages.product.validation.productNotFound });
            }

            logger.info(`Lấy thông tin sản phẩm với ID ${productId} thành công.`);
            return res.status(200).json({ product });
        } catch (error) {
            logger.error(`Lỗi khi lấy thông tin sản phẩm: ${error.message}`);
            return res.status(500).json({
                message: messages.product.error.fetchingProduct,
                error: error.message,
            });
        }
    }
}

module.exports = GetProductByIdController;
