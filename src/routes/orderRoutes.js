const express = require('express');
const router = express.Router();

const CreateOrderController = require('../controllers/commands/Order/create');
const UpdateOrderController = require('../controllers/commands/Order/update');
const DeleteOrderController = require('../controllers/commands/Order/delete');
const GetAllOrdersController = require('../controllers/queries/Order/getAll');
const GetOrderByIdController = require('../controllers/queries/Order/getById');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: API for managing orders
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     description: Create a new order. This endpoint requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 description: List of products in the order
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                       example: "63afc36fe7e3c12345abcd67"
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 description: Total price of the order
 *                 example: 199.98
 *     responses:
 *       201:
 *         description: Order successfully created
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     description: Retrieve a list of all orders. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     description: Fetch details of a specific order by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   type: object
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/{id}:
 *   put:
 *     summary: Update an order
 *     tags:
 *       - Orders
 *     description: Update an existing order by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 description: List of products in the order
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                       example: "63afc36fe7e3c12345abcd67"
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 description: Total price of the order
 *                 example: 199.98 
 *               status:
 *                 type: string
 *                 description: New status of the order
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Order successfully updated
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags:
 *       - Orders
 *     description: Remove an order by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order successfully deleted
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

// Queries
router.get('/', authMiddleware, GetAllOrdersController.handle); // Get all orders
router.get('/:id', authMiddleware, GetOrderByIdController.handle); // Get order by ID

// Commands
router.post('/', authMiddleware, CreateOrderController.handle); // Create an order
router.put('/:id', authMiddleware, UpdateOrderController.handle); // Update an order
router.delete('/:id', authMiddleware, DeleteOrderController.handle); // Delete an order

module.exports = router;
