const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const cartController = require("../controllers/cart.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-specific product interactions (Cart, Favourites)
 */

/**
 * @swagger
 * /api/user/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Product not found
 */
router.post("/cart", protect, cartController.addToCart);

/**
 * @swagger
 * /api/user/favourite:
 *   post:
 *     summary: Add product to favourites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to favourites successfully
 *       400:
 *         description: Product already in favourites
 *       404:
 *         description: Product not found
 */
router.post("/favourite", protect, cartController.addToFavourite);

module.exports = router;