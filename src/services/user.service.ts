import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
import { Payload } from "../controllers/interfaces/user.interface";
import { Response } from "express";
const bcrypt = require('bcrypt')
const crypto = require('crypto');
import { User } from "../controllers/interfaces/user.interface";
import { UserMethods } from "../repositories/user.repository";
import emailService from './email.service';

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
            
            // Check if user's email is verified - strictly enforce this
            if (!user.isVerified) {
                // Generate new verification token if the current one has expired
                if (!user.verificationToken || !user.verificationExpires || new Date(user.verificationExpires) < new Date()) {
                    const verificationToken = crypto.randomBytes(32).toString('hex');
                    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                    
                    // Update user with new verification token
                    await userMethods.updateOneUser({
                        where: { id: user.id },
                        data: {
                            verificationToken,
                            verificationExpires
                        }
                    });
                    
                    // Build verification URL with new token
                    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/user/verify/${verificationToken}`;
                    
                    // Send new verification email
                    const userForEmail: User = {
                        email: user.email,
                        pass: "",
                        name: user.name || undefined,
                        age: user.age || undefined,
                        isVerified: user.isVerified,
                        verificationToken: user.verificationToken || undefined,
                        verificationExpires: user.verificationExpires ? new Date(user.verificationExpires) : undefined,
                        deletedAt: user.deletedAt ? new Date(user.deletedAt) : undefined
                    };
                    
                    try {
                        await emailService.sendVerificationEmail(userForEmail, verificationUrl);
                        return res.status(401).json({ 
                            message: "Account not activated. A new verification email has been sent to your email address."
                        });
                    } catch (emailError) {
                        console.error("Failed to send verification email:", emailError);
                        return res.status(401).json({ 
                            message: "Account not activated. Please contact support to verify your email."
                        });
                    }
                } else {
                    return res.status(401).json({ 
                        message: "Account not activated. Please check your email for the verification link or request a new one."
                    });
                }
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
            
            // Generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            
            // Create user object compatible with Prisma schema
            const userData = {
                email: email,
                pass: hashedPass,
                name: name || undefined,
                age: age,
                isVerified: false,
                verificationToken: verificationToken,
                verificationExpires: verificationExpires
            }
            
            const payload = { data: userData }
            const newUser = await userMethods.createOneUser(payload)
            
            // Generate JWT token
            const token = this.generateToken({ userId: newUser.id })
            
            // Build verification URL
            const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/user/verify/${verificationToken}`;
            
            try {
                // Create a user object compatible with the email service expectations
                const userForEmail: User = {
                    email: newUser.email,
                    pass: "",  // Don't pass the actual hash to the email service
                    name: newUser.name || undefined,
                    age: newUser.age || undefined,
                    isVerified: newUser.isVerified,
                    verificationToken: newUser.verificationToken || undefined,
                    verificationExpires: newUser.verificationExpires ? newUser.verificationExpires : undefined
                };
                
                // Send verification email
                await emailService.sendVerificationEmail(userForEmail, verificationUrl);
                
                return res.status(200).json({ 
                    message: "Registration started. Your account will be activated after you verify your email address.",
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        isVerified: newUser.isVerified
                    },
                    token: token,
                    verificationSent: true
                });
            } catch (emailError) {
                console.error("Error sending verification email:", emailError);
                // Continue with registration even if email fails, but make it clear verification is required
                return res.status(201).json({ 
                    message: "Registration started, but we couldn't send a verification email. Please contact support to verify your account.",
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        isVerified: newUser.isVerified
                    },
                    token: token,
                    verificationSent: false 
                });
            }
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

    getUserByIdService = async (id: string, res: Response) => {
        try {
            const filter = { where: { id: id } };
            const user = await userMethods.findUniqueUser(filter);
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            return res.status(200).json(user);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ message: "Some error occurred" });
        }
    }

    verifyEmailService = async (token: string, res: Response) => {
        try {
            if (!token) {
                return res.status(400).json({ message: "Verification token is required" });
            }

            // Find user with this verification token
            const user = await prisma.user.findFirst({
                where: {
                    verificationToken: token,
                    isDeleted: false
                }
            });

            if (!user) {
                return res.status(404).json({ message: "Invalid verification token" });
            }

            // Check if token is expired
            if (!user.verificationExpires || new Date(user.verificationExpires) < new Date()) {
                return res.status(400).json({ message: "Verification token has expired. Please request a new one." });
            }

            // Update user to mark email as verified
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verificationToken: null,  // Clear the token after use
                    verificationExpires: null
                }
            });

            return res.status(200).json({ 
                message: "Email verified successfully. Your account is now activated and you can log in.",
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    isVerified: updatedUser.isVerified
                },
                accountActivated: true
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "An error occurred during verification" });
        }
    }

    resendVerificationService = async (email: string, res: Response) => {
        try {
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: email }
            });

            if (!user || user.isDeleted) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: "Email is already verified" });
            }

            // Generate new verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Update user with new token
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationToken,
                    verificationExpires
                }
            });

            // Build verification URL
            const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/user/verify/${verificationToken}`;

            // Create a user object compatible with the email service expectations
            const userForEmail: User = {
                email: user.email,
                pass: "",
                name: user.name || undefined,
                age: user.age || undefined,
                isVerified: user.isVerified,
                verificationToken: verificationToken,
                verificationExpires: verificationExpires
            };

            // Send verification email
            await emailService.sendVerificationEmail(userForEmail, verificationUrl);

            return res.status(200).json({ 
                message: "Verification email has been sent. Please check your inbox."
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "An error occurred while resending verification email" });
        }
    }
}

