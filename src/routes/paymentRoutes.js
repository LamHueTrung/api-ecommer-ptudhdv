const express = require('express');
const router = express.Router();

const CreatePaymentController = require('../controllers/commands/Payment/create');
const UpdatePaymentController = require('../controllers/commands/Payment/update');
const DeletePaymentController = require('../controllers/commands/Payment/delete');
const GetAllPaymentsController = require('../controllers/queries/Payment/getAll');
const GetPaymentByIdController = require('../controllers/queries/Payment/getById');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: API for managing payments
 */

/**
 * @swagger
 * /api/payment:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payments
 *     description: Retrieve a list of all payments.
 *     responses:
 *       200:
 *         description: Successfully retrieved payments
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags:
 *       - Payments
 *     description: Retrieve details of a specific payment by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Successfully retrieved payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Create a new payment
 *     tags:
 *       - Payments
 *     description: Create a new payment record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: string
 *                 description: ID of the associated order
 *                 example: "63afc36fe7e3c12345abcd67"
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *                 example: 100.50
 *               method:
 *                 type: string
 *                 description: Method of payment
 *                 example: "card"
 *     responses:
 *       201:
 *         description: Payment successfully created
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payment/{id}:
 *   put:
 *     summary: Update a payment
 *     tags:
 *       - Payments
 *     description: Update an existing payment by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the payment
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Payment successfully updated
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/payment/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags:
 *       - Payments
 *     description: Delete a payment record by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment successfully deleted
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */

// Queries
router.get('/', authMiddleware, GetAllPaymentsController.handle); // Get all payments
router.get('/:id', authMiddleware, GetPaymentByIdController.handle); // Get payment by ID

// Commands
router.post('/', authMiddleware, CreatePaymentController.handle); // Create a payment
router.put('/:id', authMiddleware, UpdatePaymentController.handle); // Update a payment
router.delete('/:id', authMiddleware, DeletePaymentController.handle); // Delete a payment

module.exports = router;
