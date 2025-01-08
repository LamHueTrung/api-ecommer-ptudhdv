const express = require('express');
const router = express.Router();

const AddProductToCartController = require('../controllers/commands/Cart/addProduct');
const GetAllCartsController = require('../controllers/queries/Cart/getAll');
const GetCartByIdController = require('../controllers/queries/Cart/getById');
const UpdateCartController = require('../controllers/commands/Cart/update');
const DeleteCartController = require('../controllers/commands/Cart/delete');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: API for managing the shopping cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Retrieve all carts
 *     tags:
 *       - Cart
 *     description: Retrieve a list of all shopping carts.
 *     responses:
 *       200:
 *         description: Successfully retrieved carts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Retrieve a cart by ID
 *     tags:
 *       - Cart
 *     description: Fetch details of a specific cart using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Successfully retrieved cart details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags:
 *       - Cart
 *     description: Adds a product to the user's shopping cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add to the cart
 *                 example: "63afc36fe7e3c12345abcd67"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product successfully added to the cart
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update a cart
 *     tags:
 *       - Cart
 *     description: Update details of an existing cart.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the product
 *     responses:
 *       200:
 *         description: Successfully updated cart
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete a cart
 *     tags:
 *       - Cart
 *     description: Remove a cart from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Successfully deleted cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */

// Query routes
router.get('/', authMiddleware, GetAllCartsController.handle); // Retrieve all carts
router.get('/:id', authMiddleware, GetCartByIdController.handle); // Retrieve a cart by ID

// Command routes
router.post('/add', authMiddleware, AddProductToCartController.handle); // Add product to cart
router.put('/:id', authMiddleware, UpdateCartController.handle); // Update a cart
router.delete('/:id', authMiddleware, DeleteCartController.handle); // Delete a cart

module.exports = router;
