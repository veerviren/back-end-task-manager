import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
import { Response } from "express";
const bcrypt = require('bcrypt')
import { Task } from "../controllers/interfaces/task.interface";
import { TaskMethods } from "../repositories/task.repository";

const taskMethods = new TaskMethods()

export class TaskService{

    getAlltaskService = async (userId: String, res: Response) => {
        try {
            const tasks = await taskMethods.findAllTask(userId)
            return res.status(200).json({ tasks })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    createTaskService = async (task: Task, res: Response) => {
        try {
            const payload = { data: task }
            const newTask = await taskMethods.createOneTask(payload)
            return res.status(200).json({ task: newTask })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    deleteTaskService = async (id: string, userId: string, res: Response) => {
        try {
            const deletedTask = await taskMethods.deleteOneTask(id, userId)
            return res.status(200).json({ task: deletedTask })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    updateTaskService = async (id: string, userId: string, task: Task, res: Response) => {
        try {
            const payload = { where: { id: id }, data: task }
            const updatedTask = await taskMethods.updateOneTask(id, userId, payload)
            return res.status(200).json({ task: updatedTask })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }
    
}