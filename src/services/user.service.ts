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
        const token = jwt.sign(payload.userId, process.env.SECRET)
        return token
    }

    signInService = async (email: string, pass: string, res: Response) => {
        try {
            if (!email || !pass) {
                return res.status(400).json({ message: "All fields required!" })
            }
            const filter = { where: { email: email } }
            const user = await userMethods.findUniqueUser(filter)
            const matchPassword = await bcrypt.compare(pass, user?.pass)
            if (!matchPassword) {
                return res.status(404).json({ message: "Incorrect password" })
            }
            if (!user) {
                return res.status(404).json({ message: "Unauthorized user!" })
            }
            const id = user.id
            const token = this.generateToken({ userId: id })
            return res.status(200).json({ user, token: token })
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    signUpService = async (user: User, res: Response) => {
        const { email, pass, name, age } = user
        try {

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
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    getAllUserService = async (res: Response) => {
        try {
            const users = await userMethods.findAllUser()
            return res.status(200).json(users)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
        }
    }

    deleteUserServiceasync = async (id: string, res: Response) => {
        try {
            const filter = { where: { id: id } }
            const deletedUser = await userMethods.deleteOneUser(filter)
            return res.status(200).json(deletedUser)
        }
        catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Some error occured" })
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

