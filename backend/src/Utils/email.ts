import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';

// Email configuration interface
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

// Email service class
export class Email {
  private to: string;
  private from: string;
  private subject: string;
  private message: string;
  private html?: string;

  constructor(options: EmailOptions) {
    this.to = options.email;
    this.from = `Gym App`;
    this.subject = options.subject;
    this.message = options.message;
    this.html = options.html;
  }

  // Create transporter based on environment
  private createTransport() {
    // Development: Use Nodemailer test service
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // Production: Use SendGrid or other production email service
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }

  // Send email method
  async send(template?: 'reset-password' | 'welcome') {
    // Prepare email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: convert(this.html || this.message),
      html: this.html,
      // Placeholder for future template-specific customization
      template
    };

    // Send email
    await this.createTransport().sendMail(mailOptions);
  }

  // Password reset email
  async sendPasswordReset(resetUrl: string) {
    this.html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>You have requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="
          display: inline-block; 
          padding: 10px 20px; 
          background-color: #4CAF50; 
          color: white; 
          text-decoration: none; 
          border-radius: 5px;
        ">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        <small>This link will expire in 10 minutes.</small>
      </div>
    `;

    await this.send('reset-password');
  }
}

// Utility function to send password reset email
export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const emailService = new Email({
      email,
      subject: 'Your Password Reset Token (Valid for 10 minutes)',
      message: 'Password Reset Request',
    });

    await emailService.sendPasswordReset(resetUrl);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
