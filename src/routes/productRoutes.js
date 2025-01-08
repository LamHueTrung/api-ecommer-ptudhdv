const express = require('express');
const router = express.Router();

const CreateProductController = require('../controllers/commands/Product/create');
const UpdateProductController = require('../controllers/commands/Product/update');
const DeleteProductController = require('../controllers/commands/Product/delete');
const GetAllProductsController = require('../controllers/queries/Product/getAll');
const GetProductByIdController = require('../controllers/queries/Product/getById');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API for managing products
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Add a new product to the catalog.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "Laptop"
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 1299.99
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "A high-performance laptop for professionals."
 *               stock:
 *                 type: number
 *                 description: Quantity in stock
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: Product category
 *                 example: "Electronics"
 *     responses:
 *       201:
 *         description: Product successfully created
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     description: Retrieve a list of all products.
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     description: Retrieve details of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     description: Update details of an existing product.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the product
 *                 example: "Gaming Laptop"
 *               price:
 *                 type: number
 *                 description: Updated price of the product
 *                 example: 1499.99
 *               description:
 *                 type: string
 *                 description: Updated product description
 *                 example: "An upgraded laptop for gamers."
 *               stock:
 *                 type: number
 *                 description: Updated quantity in stock
 *                 example: 30
 *               category:
 *                 type: string
 *                 description: Updated product category
 *                 example: "Electronics"
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     description: Remove a product from the catalog.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

// Queries
router.get('/', authMiddleware, GetAllProductsController.handle); // Get all products
router.get('/:id', authMiddleware, GetProductByIdController.handle); // Get a product by ID

// Commands
router.post('/', authMiddleware, CreateProductController.handle); // Create a new product
router.put('/:id', authMiddleware, UpdateProductController.handle); // Update an existing product
router.delete('/:id', authMiddleware, DeleteProductController.handle); // Delete a product

module.exports = router;
