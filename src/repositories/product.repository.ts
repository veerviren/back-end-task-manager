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
                    sellerId: userId,
                },
            },
        );
        return product
    }
    
    createOneProduct = async (payload: Payload) => {
        const createdProduct = await prisma.product.create(payload as any);
        return createdProduct;
    }

    deleteOneProduct = async (productId: string, sellerId: string) => {

        const deletedProduct = await prisma.product.update({
            where: { id: productId, sellerId: sellerId },
            data: {
                deletedAt: new Date(),
                isDeleted: true,
            },
        });

        return deletedProduct;
    };



    updateOneProduct = async (productId: string, sellerId: string, payload: any | null) => {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                sellerId: sellerId,
            },
        });

        if (!product) {
            console.log("Product not found or doesn't belong to the user");
            return;
        }

        const updateData = {
            name: payload.data.name || product.name,
            description: payload.data.description || product.description,
            price: payload.data.price || product.price,
            category: payload.data.category || product.category,
            images: payload.data.images || product.images,
            isFeatured: payload.data.isFeatured !== undefined ? payload.data.isFeatured : product.isFeatured,
            discount: payload.data.discount !== undefined ? payload.data.discount : product.discount,
            tags: payload.data.tags || product.tags,
            updatedAt: new Date(),
        };

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        return updatedProduct;
    };
}
