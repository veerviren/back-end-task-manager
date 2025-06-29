import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';

const cartService = new CartService();

export const addToCart = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { productId, quantity } = req.body;
    return cartService.addToCart(userId, productId, quantity || 1, res);
};

export const getCart = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    return cartService.getCart(userId, res);
};

export const removeFromCart = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { cartItemId } = req.params;
    return cartService.removeFromCart(userId, cartItemId, res);
};

export const clearCart = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    return cartService.clearCart(userId, res);
};
