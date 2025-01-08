const Validator = require('../../../utils/validators');
const Product = require('../../../models/Product');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API tạo sản phẩm
 */
class CreateProductController {
    /**
     * Validator cho API tạo sản phẩm
     * 
     * Chức năng: Kiểm tra tính hợp lệ của các trường dữ liệu đầu vào.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `name`, `description`, `price`, `category` và các trường khác trong `req.body`.
     * @returns {Array<string>|null} - Trả về mảng các lỗi nếu có, hoặc `null` nếu hợp lệ.
     */
    static async validator(req) {
        const { name, description, price, category } = req.body;

        return Validator.validateAll([
            Validator.notEmpty(name, messages.product.validation.notEmpty('Product name')),
            Validator.notEmpty(description, messages.product.validation.notEmpty('Product description')),
            Validator.isPositiveNumber(price, messages.product.validation.isPositiveNumber('Product price')),
            Validator.notEmpty(category, messages.product.validation.notEmpty('Product category')),
        ]);
    }

    /**
     * Xử lý API tạo sản phẩm
     * 
     * Chức năng: Tạo sản phẩm mới trong cơ sở dữ liệu nếu dữ liệu hợp lệ.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa thông tin sản phẩm trong `req.body`.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và thông tin sản phẩm đã tạo.
     */
    static async handle(req, res) {
        try {
            // Kiểm tra tính hợp lệ của dữ liệu
            const errors = await CreateProductController.validator(req);
            if (errors) {
                logger.warn(`Tạo sản phẩm thất bại: ${JSON.stringify(errors)}`);
                return res.status(400).json({ errors });
            }

            const { name, description, price, stock = 0, category, images = [] } = req.body;

            // Tạo sản phẩm mới
            const product = await Product.create({
                name,
                description,
                price,
                stock,
                category,
                images,
            });

            logger.info(`Sản phẩm mới đã được tạo: ${name}`);
            return res.status(201).json({
                message: messages.product.success.productCreated,
                product,
            });
        } catch (error) {
            logger.error(`Lỗi khi tạo sản phẩm: ${error.message}`);
            return res.status(500).json({
                message: messages.product.error.creatingProduct,
                error: error.message,
            });
        }
    }
}

module.exports = CreateProductController;
