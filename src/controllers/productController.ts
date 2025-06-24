import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import { ProductService } from '../services/product.service'
import { Product } from './interfaces/product.interface'

const productService = new ProductService()

export const getAllProducts = async (req: Request, res: Response) => {
    console.log("GET '/products'");
    const userId = (req as any).locals.userId;
    console.log("userId is", userId);
    const response = productService.getAllProductService(userId, res);
    return response;
}

export const createProduct = async (req: Request, res: Response) => {
    console.log("POST '/product created'");
    const sellerId = (req as any).locals.userId;
    const {
        name,
        description,
        price,
        category,
        images,
        isFeatured,
        discount,
        tags
    } = req.body;
    
    const productDetails: Product = {
        name: name,
        description: description,
        price: price || 0, // Default price to 0 if not provided
        sellerId: sellerId,
        category: category,
        images: images,
        isFeatured: isFeatured,
        discount: discount,
        tags: tags
    };
    
    const response = productService.createProductService(productDetails, res);
    return response;
}

export const deleteOneProduct = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { id } = req.params;
    console.log(`DELETE '/products/${id}`);
    const response = productService.deleteProductService(id, userId, res);
    return response;
}

export const updateOneProduct = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { id } = req.params;
    const product = req.body;
    console.log(`PATCH '/products/${id}'`);
    const response = productService.updateProductService(id, userId, product, res);
    return response;
}
