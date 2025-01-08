const Cart = require('../../../models/Cart');
const logger = require('../../../config/logger');

class DeleteCartController {
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
            const errors = await DeleteCartController.validator(req);
            if (errors) {
                return res.status(400).json({ errors });
            }

            const { id } = req.params;
            await Cart.findByIdAndDelete(id);

            return res.status(200).json({ message: 'Cart deleted successfully' });
        } catch (error) {
            logger.error(`Error deleting cart: ${error.message}`);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = DeleteCartController;
