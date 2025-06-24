import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
import { Payload } from "../controllers/interfaces/user.interface";
import { Response } from "express";
const bcrypt = require('bcrypt')
import { User } from "../controllers/interfaces/user.interface";
import { UserMethods } from "../repositories/user.repository";

const userMethods = new UserMethods()
export class UserService {

    generateToken = (payload: Payload) => {
        const token = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET)
        return token
    }

    signInService = async (email: string, pass: string, res: Response) => {
        try {
            if (!email || !pass) {
                return res.status(400).json({ message: "All fields required!" })
            }
            const filter = { where: { email: email } }
            const user = await userMethods.findUniqueUser(filter)
            
            if (!user) {
                return res.status(404).json({ message: "User not found. Please check your email or sign up." })
            }
            
            const matchPassword = await bcrypt.compare(pass, user.pass)
            if (!matchPassword) {
                return res.status(401).json({ message: "Incorrect password" })
            }
            
            const id = user.id
            const token = this.generateToken({ userId: id })
            return res.status(200).json({ user, token: token })
        }
        catch (err: any) {
            console.log(err)
            return res.status(400).json({ message: "Some error occurred" })
        }
    }

    signUpService = async (user: User, res: Response) => {
        const { email, pass, name, age } = user
        try {
            // Check if user with email already exists
            const existingUser = await userMethods.findUniqueUser({
                where: { email: email }
            });
            
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use. Please use a different email or sign in." });
            }

            const hashedPass = await bcrypt.hash(pass, 10)
            const user: User = {
                email: email,
                pass: hashedPass,
                name: name,
                age: age
            }
            const payload = { data: user }
            const newUser = await userMethods.createOneUser(payload)
            const token = this.generateToken({ userId: newUser.id })
            return res.status(200).json({ user: newUser, token: token })
        }
        catch (err: any) {
            console.log(err)
            // Check for Prisma unique constraint error
            if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
                return res.status(400).json({ message: "Email already in use. Please use a different email or sign in." });
            }
            return res.status(400).json({ message: "Some error occurred" })
        }
    }

    getAllUserService = async (includeDeleted: boolean, res: Response) => {
        try {
            const users = await userMethods.findAllUser(includeDeleted)
            return res.status(200).json(users)
        }
        catch (err: any) {
            console.log(err)
            return res.status(400).json({ message: "Some error occurred" })
        }
    }

    deleteUserService = async (id: string, res: Response) => {
        try {
            const filter = { where: { id: id } }
            // Use soft delete instead of hard delete
            const deletedUser = await userMethods.softDeleteOneUser(filter)
            return res.status(200).json({
                message: "User successfully deleted",
                user: {
                    id: deletedUser.id,
                    email: deletedUser.email,
                    deletedAt: deletedUser.deletedAt || null
                }
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occurred" })
        }
    }

    updateUserService = async (id: string, user: User, res: Response) => {
        try {
            const payload = {
                where: { id: id },
                data: user
            }
            const updatedUser = await userMethods.updateOneUser(payload)
            return res.status(200).json(updatedUser)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }
}

