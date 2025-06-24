/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - sellerId
 *         - name
 *         - price
 *       properties:
 *         sellerId:
 *           type: string
 *           description: The ID of the user who is selling this product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         category:
 *           type: string
 *           description: Product category
 *         isSold:
 *           type: boolean
 *           description: Whether the product has been sold
 *         soldAt:
 *           type: string
 *           format: date-time
 *           description: When the product was sold
 *         buyerId:
 *           type: string
 *           description: ID of the user who bought the product
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of product images
 *         rating:
 *           type: number
 *           description: Average product rating
 *         isFeatured:
 *           type: boolean
 *           description: Whether the product is featured
 *         discount:
 *           type: number
 *           description: Discount percentage
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags for search
 */
export interface Product {
    sellerId: string
    name: string;
    description?: string;
    price: number;
    category?: string;
    isSold?: boolean;
    soldAt?: Date;
    buyerId?: string;
    images?: string[];
    rating?: number;
    isFeatured?: boolean;
    discount?: number;
    tags?: string[];
}
