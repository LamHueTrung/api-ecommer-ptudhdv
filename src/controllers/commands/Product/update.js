const Validator = require('../../../utils/validators');
const Product = require('../../../models/Product');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API cập nhật sản phẩm
 */
class UpdateProductController {
    /**
     * Validator cho API cập nhật sản phẩm
     * 
     * Chức năng: Kiểm tra tính hợp lệ của các trường dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `name`, `description`, `price`, `category` và các trường khác trong `req.body`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { name, description, price, category } = req.body;

        return Validator.validateAll([
            name && Validator.notEmpty(name, messages.product.validation.notEmpty('Product name')),
            description && Validator.notEmpty(description, messages.product.validation.notEmpty('Product description')),
            price && Validator.isPositiveNumber(price, messages.product.validation.isPositiveNumber('Product price')),
            category && Validator.notEmpty(category, messages.product.validation.notEmpty('Product category')),
        ]);
    }

    /**
     * Xử lý API cập nhật sản phẩm
     * 
     * Chức năng: Cập nhật sản phẩm trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa thông tin sản phẩm cần cập nhật trong `req.body` và ID sản phẩm trong `req.params`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin sản phẩm đã cập nhật.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của dữ liệu
            const errors = await UpdateProductController.validator(req);
            if (errors) {
                logger.warn(`Cập nhật sản phẩm thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const productId = req.params.id;
            const updatedData = req.body;

            // Cập nhật sản phẩm
            const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

            if (!product) {
                logger.warn(`Sản phẩm với ID ${productId} không tồn tại.`);
                return res.status(404).json({ message: messages.product.validation.productNotFound });
            }

            logger.info(`Sản phẩm với ID ${productId} đã được cập nhật thành công.`);
            return res.status(200).json({
                message: messages.product.success.productUpdated,
                product,
            });
        } catch (error) {
            logger.error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
            return res.status(500).json({
                message: messages.product.error.updatingProduct,
                error: error.message,
            });
        }
    }
}

module.exports = UpdateProductController;
