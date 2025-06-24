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
    // Check for query parameter to include soft-deleted users
    const includeDeleted = req.query.includeDeleted === 'true'
    const response = userService.getAllUserService(includeDeleted, res)
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
    return response
}

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(`GET '/${id}'`)
    const response = userService.getUserByIdService(id, res)
    return response
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params
    console.log(`GET '/verify/${token}'`)
    const response = userService.verifyEmailService(token, res)
    return response
}

export const resendVerification = async (req: Request, res: Response) => {
    const { email } = req.body
    console.log(`POST '/resend-verification'`)
    const response = userService.resendVerificationService(email, res)
    return response
}