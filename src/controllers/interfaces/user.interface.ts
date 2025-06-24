/**
 * @swagger
 * components:
 *   schemas:
 *     Payload:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID
 */
export interface Payload {
    userId: String,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - pass
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         age:
 *           type: integer
 *           description: The age of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         pass:
 *           type: string
 *           description: The password of the user (hashed)
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was soft-deleted
 *         isDeleted:
 *           type: boolean
 *           description: Whether the user is soft-deleted
 */
export interface User {
    name?: string,
    age?: number,
    email: string,
    pass: string,
    deletedAt?: Date,
    isDeleted?: boolean,
}