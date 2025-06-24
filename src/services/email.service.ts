import nodemailer from 'nodemailer';
import { User } from '../controllers/interfaces/user.interface';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // For development, we can use a test account from Ethereal
        // In production, you would use your actual SMTP configuration
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASS || '',
            },
        });
    }

    /**
     * Send a verification email to a user
     * @param user The user to send the verification email to
     * @param verificationUrl The URL that the user should visit to verify their email
     * @returns Promise that resolves when the email is sent
     */
    async sendVerificationEmail(user: User, verificationUrl: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@productmanager.com',
            to: user.email,
            subject: 'Email Verification - Product Manager',
            html: `
                <h1>Email Verification</h1>
                <p>Hello ${user.name || 'there'},</p>
                <p>Thank you for registering with our Product Manager application. Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Product Manager Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    /**
     * Send a password reset email to a user
     * @param user The user to send the password reset email to
     * @param resetUrl The URL that the user should visit to reset their password
     * @returns Promise that resolves when the email is sent
     */
    async sendPasswordResetEmail(user: User, resetUrl: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@productmanager.com',
            to: user.email,
            subject: 'Password Reset - Product Manager',
            html: `
                <h1>Password Reset</h1>
                <p>Hello ${user.name || 'there'},</p>
                <p>You requested a password reset for your Product Manager account. Please click the link below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br>The Product Manager Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
}

export default new EmailService();
