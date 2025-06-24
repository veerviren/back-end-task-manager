import { PrismaClient } from "@prisma/client";
import { Product } from "../controllers/interfaces/product.interface";
const prisma = new PrismaClient()

interface Payload {
    data: Product
}

export class ProductMethods {
    
    findAllProduct = async (userId: any) => {
        const product = await prisma.product.findMany(
            {
                where: {
                    userId: userId,
                },
            },
        );
        return product
    }
    
    createOneProduct = async (payload: Payload) => {
        const createdProduct = await prisma.product.create(payload as any);
        return createdProduct;
    }

    deleteOneProduct = async (productId: string, userId: string) => {

        const deletedProduct = await prisma.product.update({
            where: { id: productId, userId: userId },
            data: {
                deletedAt: new Date(),
                isDeleted: true,
            },
        });

        return deletedProduct;
    };



    updateOneProduct = async (productId: string, userId: string, payload: any | null) => {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                userId: userId,
            },
        });

        if (!product) {
            console.log("Product not found or doesn't belong to the user");
            return;
        }

        const updateData = {
            name: payload.data.name || product.name,
            description: payload.data.description || product.description,
            dueDate: payload.data.dueDate || product.dueDate,
            updatedAt: new Date(),
        };

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        return updatedProduct;
    };
}
