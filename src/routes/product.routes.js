const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shoeName
 *               - price
 *               - shoeBrand
 *               - sizes
 *             properties:
 *               shoeName:
 *                 type: string
 *               shoeBrand:
 *                 type: string
 *               shoeColor:
 *                 type: string
 *               price:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     country:
 *                       type: string
 *                       enum: [UK, US, EU]
 *                     values:
 *                       type: array
 *                       items:
 *                         type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", protect, productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or brand
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/", productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shoeName:
 *                 type: string
 *               shoeBrand:
 *                 type: string
 *               shoeColor:
 *                 type: string
 *               price:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     country:
 *                       type: string
 *                       enum: [UK, US, EU]
 *                     values:
 *                       type: array
 *                       items:
 *                         type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, productController.updateProduct);

module.exports = router;