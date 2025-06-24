import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = await req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Authentication required. Please include a valid token in the Authorization header." })
    }
    try {
        const token = authorization.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.userId || decoded
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            console.log("User not found for the provided token");
            return res.status(404).json({ message: "User not found. The user associated with this token may have been deleted." })
        }
        
        // Check if the user's email is verified
        if (!user.isVerified) {
            console.log("Unverified user attempted to access protected route:", user.email);
            return res.status(403).json({ 
                message: "Email verification required. Please verify your email before accessing this resource.",
                verified: false
            });
        }
        
        (req as any).locals = {
            userId: userId,
            isVerified: user.isVerified
        };
        next()
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Invalid or expired token. Please authenticate again." })
    }
}