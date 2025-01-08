const express = require('express');
const router = express.Router();

const CreateReviewController = require('../controllers/commands/Review/create');
const DeleteReviewController = require('../controllers/commands/Review/delete');
const GetAllReviewsController = require('../controllers/queries/Review/getAll');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: API for managing product reviews
 */

/**
 * @swagger
 * /api/review/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags:
 *       - Reviews
 *     description: Retrieve all reviews for a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Review ID
 *                   user:
 *                     type: string
 *                     description: User ID
 *                   product:
 *                     type: string
 *                     description: Product ID
 *                   rating:
 *                     type: integer
 *                     description: Rating given by the user
 *                   comment:
 *                     type: string
 *                     description: Comment on the product
 *       404:
 *         description: Product not found or no reviews available
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a new review
 *     tags:
 *       - Reviews
 *     description: Add a new review for a product. This endpoint requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID of the product being reviewed
 *                 example: "64b123f8a1234567890c7890"
 *               rating:
 *                 type: integer
 *                 description: Rating for the product (1-5)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *                 example: "Amazing product! Highly recommend."
 *     responses:
 *       201:
 *         description: Review successfully created
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/review/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Reviews
 *     description: Delete a specific review by its ID. This endpoint requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review successfully deleted
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

// Queries
router.get('/:productId', authMiddleware, GetAllReviewsController.handle); // Get all reviews for a product

// Commands
router.post('/', authMiddleware, CreateReviewController.handle); // Create a new review
router.delete('/:id', authMiddleware, DeleteReviewController.handle); // Delete a review

module.exports = router;
