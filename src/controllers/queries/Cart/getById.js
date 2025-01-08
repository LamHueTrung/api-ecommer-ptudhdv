const Cart = require('../../../models/Cart');
const logger = require('../../../config/logger');

class GetCartByIdController {
    static async validator(req) {
        const { id } = req.params;

        if (!id) {
            return ['Cart ID is required'];
        }

        const existingCart = await Cart.findById(id);
        if (!existingCart) {
            return ['Cart not found'];
        }

        return null;
    }

    static async handle(req, res) {
        try {
            const errors = await GetCartByIdController.validator(req);
            if (errors) {
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            const cart = await Cart.findById(id).populate('user', 'name email');

            return res.status(200).json({ cart });
        } catch (error) {
            logger.error(`Error fetching cart by ID: ${error.message}`);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = GetCartByIdController;
