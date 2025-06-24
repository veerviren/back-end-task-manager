const express = require('express')
const router = express.Router()

import { getAllProducts, createProduct, deleteOneProduct, updateOneProduct } from "../controllers/productController"

import { userAuth } from "../middleware/jwt.middleware";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

router.use(userAuth);

console.log("productRoutes called");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all products for the authenticated user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not authenticated
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products:
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Some error occurred
 *       401:
 *         description: Not authenticated
 */
router.post("/", createProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   patch:
 *     summary: Soft delete a product by id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: The product was not found or doesn't belong to the user
 */
router.patch("/delete/:id", deleteOneProduct);

/**
 * @swagger
 * /products/update/{id}:
 *   patch:
 *     summary: Update a product by id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: The product was not found or doesn't belong to the user
 */
router.patch("/update/:id", updateOneProduct);



module.exports = router;
