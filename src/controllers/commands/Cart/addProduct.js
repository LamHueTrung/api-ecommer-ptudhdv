const Cart = require('../../../models/Cart');
const logger = require('../../../config/logger');
const messages = require('../../../utils/messages');

/**
 * Controller xử lý API thêm sản phẩm vào giỏ hàng
 */
class AddProductToCartController {
    /**
     * Xử lý API thêm sản phẩm vào giỏ hàng
     * 
     * Chức năng: Thêm sản phẩm vào giỏ hàng của người dùng. Nếu giỏ hàng chưa tồn tại, tạo mới. 
     * Nếu sản phẩm đã có trong giỏ, tăng số lượng tương ứng.
     * 
     * @param {Object} req - Đối tượng request từ client, chứa `productId`, `quantity` trong `req.body` và `user.id` từ JWT middleware.
     * @param {Object} res - Đối tượng response để gửi phản hồi về client.
     * @returns {Object} - Phản hồi JSON chứa thông báo và trạng thái giỏ hàng.
     */
    static async handle(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id; // Lấy ID người dùng từ JWT middleware

            // Kiểm tra xem giỏ hàng của người dùng đã tồn tại chưa
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                logger.info(`Giỏ hàng mới được tạo cho người dùng: ${userId}`);
                cart = await Cart.create({ user: userId, products: [] });
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingProduct = cart.products.find(
                (p) => p.product.toString() === productId
            );

            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                existingProduct.quantity += quantity;
                logger.info(
                    `Tăng số lượng sản phẩm (ID: ${productId}) trong giỏ hàng của người dùng: ${userId}`
                );
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ
                cart.products.push({ product: productId, quantity });
                logger.info(
                    `Thêm sản phẩm mới (ID: ${productId}) vào giỏ hàng của người dùng: ${userId}`
                );
            }

            // Lưu giỏ hàng sau khi cập nhật
            await cart.save();

            logger.info(`Giỏ hàng của người dùng ${userId} đã được cập nhật thành công.`);
            return res.status(200).json({
                message: messages.cart.success.productAdded,
                cart,
            });
        } catch (error) {
            logger.error(`Lỗi khi thêm sản phẩm vào giỏ hàng: ${error.message}`);
            return res.status(500).json({
                message: messages.cart.error.addingProduct,
                error: error.message,
            });
        }
    }
}

module.exports = AddProductToCartController;
