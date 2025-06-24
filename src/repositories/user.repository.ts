import { PrismaClient } from "@prisma/client";
import { User } from "../controllers/interfaces/user.interface";
const prisma = new PrismaClient()

interface Payload {
    data: User
}

export class UserMethods {
    findUniqueUser = async (filter: any | null) => {
        if (!filter) return null;
        
        // First try to find the user with the exact filter
        const exactUser = await prisma.user.findUnique(filter);
        
        // If no user found or the user is soft-deleted, return null
        if (!exactUser || exactUser.isDeleted) {
            return null;
        }
        
        return exactUser;
    }

    findAllUser = async (includeDeleted = false) => {
        // Build where clause based on includeDeleted parameter
        const whereClause = includeDeleted ? {} : { isDeleted: false };
        
        const users = await prisma.user.findMany({
            where: whereClause
        })
        return users
    }


    createOneUser = async (payload: Payload) => {
        const createdUser = await prisma.user.create(payload)
        return createdUser
    }

    // Hard delete (for admin purposes only)
    deleteOneUser = async (filter: any | null) => {
        // First delete all related tasks, then delete the user within a transaction
        const deletedUser = await prisma.$transaction(async (tx) => {
            // Delete all tasks associated with this user
            await tx.task.deleteMany({
                where: {
                    userId: filter.where.id
                }
            });
            
            // Then delete the user
            return tx.user.delete(filter);
        });
        
        return deletedUser;
    }
    
    // Soft delete (preferred method for production use)
    softDeleteOneUser = async (filter: any | null) => {
        const now = new Date();
        const softDeletedUser = await prisma.user.update({
            where: filter.where,
            data: {
                isDeleted: true,
                deletedAt: now,
                // Also mark all related tasks as deleted
                tasks: {
                    updateMany: {
                        where: {
                            userId: filter.where.id,
                            isDeleted: false
                        },
                        data: {
                            isDeleted: true,
                            deletedAt: now
                        }
                    }
                }
            }
        });
        
        return softDeletedUser;
    }

    updateOneUser = async (payload: any | null) => {
        const updatedUser = await prisma.user.update(payload)
        return updatedUser
    }



}