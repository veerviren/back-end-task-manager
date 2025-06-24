import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import { UserService } from '../services/user.service'

const userService = new UserService()

export const signIn = async (req: Request, res: Response) => {
    console.log("POST '/signin'")
    const { email, pass } = req.body
    const response = userService.signInService(email, pass, res)
    return response
}

export const signUp = async (req: Request, res: Response) => {
    console.log("POST '/signup'")
    const { email, pass, name, age } = req.body
    const userDetails = {
        email, pass, name, age
    }
    const response = userService.signUpService(userDetails, res)
    return response
}

export const getAllUsers = async (req: Request, res: Response) => {
    console.log("GET '/'")
    const response = userService.getAllUserService(res)
    return response
}



export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(`DELETE '/${id}`)
    const response = userService.deleteUserService(id, res)
    return response
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.body
    console.log(`PATCH '/${id}'`)
    const response = userService.updateUserService(id, user, res)
}