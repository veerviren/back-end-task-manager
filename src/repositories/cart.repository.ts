import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CartRepository {
    async addToCart(userId: string, productId: string, quantity: number = 1) {
        // If item already in cart, increase quantity
        const existing = await prisma.cartItem.findFirst({
            where: { userId, productId },
        });
        if (existing) {
            return prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity },
            });
        }
        return prisma.cartItem.create({
            data: { userId, productId, quantity },
        });
    }

    async getCart(userId: string) {
        return prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
    }

    async removeFromCart(cartItemId: string, userId: string) {
        return prisma.cartItem.delete({
            where: { id: cartItemId, userId },
        });
    }

    async clearCart(userId: string) {
        return prisma.cartItem.deleteMany({
            where: { userId },
        });
    }
}
