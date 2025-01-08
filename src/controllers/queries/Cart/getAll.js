const Cart = require('../../../models/Cart');
const logger = require('../../../config/logger');

class GetAllCartsController {
    static async handle(req, res) {
        try {
            const carts = await Cart.find().populate('user', 'name email');
            return res.status(200).json({ carts });
        } catch (error) {
            logger.error(`Error fetching carts: ${error.message}`);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

module.exports = GetAllCartsController;
