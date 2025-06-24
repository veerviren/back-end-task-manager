/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who owns this product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date for the product (if applicable)
 */
export interface Product {
    userId: string
    name: string;
    description?: string;
    dueDate?: Date;
}
