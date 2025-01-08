const express = require('express');
const router = express.Router();

const user = require('./userRoutes');
const product = require('./productRoutes');
const review = require('./reviewRoutes');
const cart = require('./cartRoutes');
const order = require('./orderRoutes');
const payment = require('./paymentRoutes');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 *   - name: Products
 *     description: API for managing products
 *   - name: Orders
 *     description: API for managing orders
 *   - name: Payments
 *     description: API for managing payments
 *   - name: Reviews
 *     description: API for managing reviews
 *   - name: Cart
 *     description: API for managing the shopping cart
 */
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: User-related operations
 *     tags:
 *       - Users
 *     description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Product-related operations
 *     tags:
 *       - Products
 *     description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/review:
 *   get:
 *     summary: Review-related operations
 *     tags:
 *       - Reviews
 *     description: API endpoints for managing reviews
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Cart-related operations
 *     tags:
 *       - Cart
 *     description: API endpoints for managing the shopping cart
 */

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Order-related operations
 *     tags:
 *       - Orders
 *     description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/payment:
 *   get:
 *     summary: Payment-related operations
 *     tags:
 *       - Payments
 *     description: API endpoints for managing payments
 */

// Routes
router.use('/api/user', user);
router.use('/api/product', product);
router.use('/api/review', review);
router.use('/api/cart', cart);
router.use('/api/order', order);
router.use('/api/payment', payment);

module.exports = router;
