const Cart = require('../../../models/Cart');
const Validator = require('../../../utils/validators');
const logger = require('../../../config/logger');

class UpdateCartController {
    static async validator(req) {
        const { id } = req.params;
        const { products } = req.body;

        const errors = [];

        if (!id) {
            errors.push('Cart ID is required');
        } else {
            const existingCart = await Cart.findById(id);
            if (!existingCart) {
                errors.push('Cart not found');
            }
        }

        if (!Array.isArray(products) || products.length === 0) {
            errors.push('Products must be a non-empty array');
        } else {
            products.forEach((product, index) => {
                if (!product.product) {
                    errors.push(`Product ID is required at index ${index}`);
                }
                if (typeof product.quantity !== 'number' || product.quantity <= 0) {
                    errors.push(`Quantity must be a positive number at index ${index}`);
                }
            });
        }

        return errors.length > 0 ? errors : null;
    }

    static async handle(req, res) {
        try {
            const errors = await UpdateCartController.validator(req);
            if (errors) {
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            const { products } = req.body;

            const cart = await Cart.findByIdAndUpdate(
                id,
                { products },
                { new: true }
            ).populate('user', 'name email');

            return res.status(200).json({ message: 'Cart updated successfully', cart });
        } catch (error) {
            logger.error(`Error updating cart: ${error.message}`);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = UpdateCartController;
