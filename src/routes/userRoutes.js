const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/commands/User/login');
const CreateUserController = require('../controllers/commands/User/create');
const UpdateUserController = require('../controllers/commands/User/update');
const DeleteUserController = require('../controllers/commands/User/delete');
const GetAllUsersController = require('../controllers/queries/User/getAll');
const GetUserByIdController = require('../controllers/queries/User/getById');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API for managing users
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Users
 *     description: Authenticate user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     description: Add a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: User password.
 *                 example: "strongpassword123"
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - Users
 *     description: Update an existing user's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user.
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 description: Updated email of the user.
 *                 example: "janedoe@example.com"
 *               password:
 *                 type: string
 *                 description: Updated password.
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     description: Remove a user from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Users
 *     description: Fetch a list of all users.
 *     responses:
 *       200:
 *         description: Successfully retrieved user list.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags:
 *       - Users
 *     description: Fetch a specific user's details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

// Login route
router.post('/login', LoginController.handle); // Login user

// Command routes
router.post('/', CreateUserController.handle); // Create a new user
router.put('/:id', authMiddleware, UpdateUserController.handle); // Update user details
router.delete('/:id', authMiddleware, DeleteUserController.handle); // Delete a user

// Query routes
router.get('/', GetAllUsersController.handle); // Get all users
router.get('/:id', GetUserByIdController.handle); // Get user by ID

module.exports = router;
