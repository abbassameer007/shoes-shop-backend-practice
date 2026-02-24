const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {protect} =require('../middlewares/auth.middleware')



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */


router.post("/signup", authController.signup);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: zk@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome back, <username>! Login successful.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiI6IkpXVCJ9...
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-03-03T15:46:54.872Z
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 699dc7bb69b841c21ea3
 *                     name:
 *                       type: string
 *                       example: M Zubair
 *                     email:
 *                       type: string
 *                       example: zk@gmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-02-24T15:46:03.119Z
 */

router.post("/login", authController.login);





/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
//for testing middleware is working right or not
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user
  });
});

module.exports = router;