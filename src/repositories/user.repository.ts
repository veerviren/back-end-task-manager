import { PrismaClient } from "@prisma/client";
import { User } from "../controllers/interfaces/user.interface";
const prisma = new PrismaClient()

interface Payload {
    data: User
}

export class UserMethods {
    findUniqueUser = async (filter: any | null) => {
        const user = await prisma.user.findUnique(filter)
        return user
    }

    findAllUser = async () => {
        const user = await prisma.user.findMany()
        return user
    }


    createOneUser = async (payload: Payload) => {
        const createdUser = await prisma.user.create(payload)
        return createdUser
    }

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

    updateOneUser = async (payload: any | null) => {
        const updatedUser = await prisma.user.update(payload)
        return updatedUser
    }



}