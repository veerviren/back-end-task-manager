const express = require('express');
const router = express.Router();

import { addToCart, getCart, removeFromCart, clearCart } from '../controllers/cartController';
import { userAuth } from '../middleware/jwt.middleware';

router.use(userAuth);

// Add product to cart
router.post('/add', addToCart);

// Get all cart items for user
router.get('/', getCart);

// Remove item from cart
router.delete('/:cartItemId', removeFromCart);

// Clear all items from cart
router.delete('/', clearCart);

module.exports = router;
