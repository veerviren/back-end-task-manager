import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
import { Response } from "express";
const bcrypt = require('bcrypt')
import { Product } from "../controllers/interfaces/product.interface";
import { ProductMethods } from "../repositories/product.repository";

const productMethods = new ProductMethods()

export class ProductService{

    getAllProductService = async (userId: String, res: Response) => {
        try {
            const products = await productMethods.findAllProduct(userId)
            return res.status(200).json({ products })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    createProductService = async (product: Product, res: Response) => {
        try {
            const payload = { data: product }
            const newProduct = await productMethods.createOneProduct(payload)
            return res.status(200).json({ product: newProduct })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    deleteProductService = async (id: string, userId: string, res: Response) => {
        try {
            const deletedProduct = await productMethods.deleteOneProduct(id, userId)
            return res.status(200).json({ product: deletedProduct })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    updateProductService = async (id: string, userId: string, product: Product, res: Response) => {
        try {
            const payload = { where: { id: id }, data: product }
            const updatedProduct = await productMethods.updateOneProduct(id, userId, payload)
            return res.status(200).json({ product: updatedProduct })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }
    
}
