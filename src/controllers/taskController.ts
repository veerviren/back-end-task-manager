import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import { TaskService } from '../services/task.service'
import { Task } from './interfaces/task.interface'

const taskService = new TaskService()

export const getAllTasks = async (req: Request, res: Response) => {
    console.log("GET '/tasks'");
    const userId = (req as any).locals.userId;
    console.log("userId is", userId);
    const response = taskService.getAlltaskService(userId, res);
    return response;
}

export const createTask = async (req: Request, res: Response) => {
    console.log("POST '/task created'");
    const userId = (req as any).locals.userId;
    const {  name, description, dueDate } = req.body;
    const taskDetails: Task = {
        name: name,
        description: description,
        dueDate: dueDate,
        userId: userId
    };
    const response = taskService.createTaskService(taskDetails, res);
    return response;
}

export const deleteOneTask = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { id } = req.params;
    console.log(`DELETE '/tasks/${id}`);
    const response = taskService.deleteTaskService(id, userId, res);
    return response;
}

export const updateOneTask = async (req: Request, res: Response) => {
    const userId = (req as any).locals.userId;
    const { id } = req.params;
    const task = req.body;
    console.log(`PATCH '/tasks/${id}'`);
    const response = taskService.updateTaskService(id, userId, task, res);
    return response;
}
