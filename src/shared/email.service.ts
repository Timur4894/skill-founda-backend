import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email: string, newPassword: string): Promise<void> {
    const subject = 'New password - Skill Foundation';
    const html = this.generatePasswordResetHTML(newPassword);
    
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: html,
      });
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      // Fallback: выводим в консоль для разработки
      console.log('='.repeat(50));
      console.log('EMAIL SENT TO:', email);
      console.log('NEW PASSWORD:', newPassword);
      console.log('='.repeat(50));
    }
  }

  private generatePasswordResetHTML(newPassword: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .password-box { background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .password { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New password</h1>
            <p>Skill Foundation</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>You requested a new password for your account in Skill Foundation.</p>
            
            <div class="password-box">
              <p><strong>Your new password:</strong></p>
              <div class="password">${newPassword}</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> We recommend changing this password to a more secure one after logging in.
            </div>
            
            <p>Now you can log in using this password.</p>
            
            <p>If you did not request a password reset, please contact our support service.</p>
          </div>
          <div class="footer">
            <p>© 2024 Skill Foundation. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
