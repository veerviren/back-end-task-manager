import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = await req.headers;

    if (!authorization) {
        return res.status(404).json({ message: "Not authorized" })
    }
    try {
        const token = authorization.split(" ")[1]
        const userId: string = await jwt.verify(token, process.env.SECRET)
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            console.log("No user present");
            return res.status(404).json({ message: "No user present" })
        }
        
        (req as any).locals = {
            userId: userId,
        };
        next()
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Some error occured" })
    }
}