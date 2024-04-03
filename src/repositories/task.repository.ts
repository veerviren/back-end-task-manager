import { PrismaClient } from "@prisma/client";
import { Task } from "../controllers/interfaces/task.interface";
const prisma = new PrismaClient()

interface Payload {
    data: Task
}

export class TaskMethods {
    
    findAllTask = async (userId: any) => {
        const task = await prisma.task.findMany(
            {
                where: {
                    userId: userId,
                },
            },
        );
        return task
    }
    
    createOneTask = async (payload: Payload) => {
        const createdTask = await prisma.task.create(payload as any);
        return createdTask;
    }

    deleteOneTask = async (taskId: string, userId: string) => {

        const deletedTask = await prisma.task.update({
            where: { id: taskId, userId: userId },
            data: {
                deletedAt: new Date(),
                isDeleted: true,
            },
        });

        return deletedTask;
    };



    updateOneTask = async (taskId: string, userId: string, payload: any | null) => {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
                userId: userId,
            },
        });

        if (!task) {
            console.log("Task not found or doesn't belong to the user");
            return;
        }

        const updateData = {
            name: payload.data.name || task.name,
            description: payload.data.description || task.description,
            dueDate: payload.data.dueDate || task.dueDate,
            updatedAt: new Date(),
        };

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        return updatedTask;
    };
}