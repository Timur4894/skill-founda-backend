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

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const subject = 'Reset Your Password - Skill Foundation';
    const apiUrl = process.env.BACKEND_URL || process.env.BASE_URL || 'http://localhost:3000';
    const html = this.generatePasswordResetHTML(apiUrl, resetToken);
    
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
      console.log('RESET TOKEN:', resetToken);
      console.log('API URL:', apiUrl);
      console.log('='.repeat(50));
    }
  }

  private generatePasswordResetHTML(apiUrl: string, resetToken: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content { 
            padding: 40px 30px; 
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #212529;
          }
          .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
            box-sizing: border-box;
          }
          .form-group input:focus {
            outline: none;
            border-color: #667eea;
          }
          .submit-button {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
            margin-top: 10px;
          }
          .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
          }
          .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          .info-box { 
            background: #f8f9fa; 
            border-left: 4px solid #667eea; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 4px;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            color: #856404; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 25px 0; 
            font-size: 14px;
          }
          .success-message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 25px 0;
            display: none;
          }
          .error-message {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 25px 0;
            display: none;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #666; 
            font-size: 14px; 
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          p {
            margin: 15px 0;
            color: #495057;
          }
          h2 {
            color: #212529;
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Skill Foundation</p>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>You requested to reset your password for your Skill Foundation account.</p>
            
            <div class="info-box">
              <p style="margin: 0;"><strong>Please enter your new password below:</strong></p>
            </div>
            
            <form id="resetPasswordForm" onsubmit="handleSubmit(event)">
              <input type="hidden" name="token" value="${resetToken}">
              
              <div class="form-group">
                <label for="newPassword">New Password:</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  required 
                  minlength="6"
                  placeholder="Enter your new password (min 6 characters)"
                >
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  required 
                  minlength="6"
                  placeholder="Confirm your new password"
                >
              </div>
              
              <button type="submit" class="submit-button" id="submitButton">
                Reset Password
              </button>
            </form>
            
            <div class="success-message" id="successMessage">
              ✅ Password has been reset successfully! You can now log in with your new password.
            </div>
            
            <div class="error-message" id="errorMessage">
              ❌ An error occurred. Please try again or contact support.
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Password must be at least 6 characters long</li>
                <li>This form will expire in 1 hour</li>
                <li>If you didn't request a password reset, please ignore this email</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2024 Skill Foundation. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              This is an automated email, please do not reply.
            </p>
          </div>
        </div>
        
        <script>
          function handleSubmit(event) {
            event.preventDefault();
            
            const form = event.target;
            const submitButton = document.getElementById('submitButton');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const token = form.token.value;
            
            // Скрываем предыдущие сообщения
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Проверяем совпадение паролей
            if (newPassword !== confirmPassword) {
              errorMessage.textContent = '❌ Passwords do not match!';
              errorMessage.style.display = 'block';
              return;
            }
            
            // Проверяем минимальную длину
            if (newPassword.length < 6) {
              errorMessage.textContent = '❌ Password must be at least 6 characters long!';
              errorMessage.style.display = 'block';
              return;
            }
            
            // Отключаем кнопку
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            // Отправляем запрос на сервер
            fetch('${apiUrl}/auth/reset-password-with-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: token,
                newPassword: newPassword
              })
            })
            .then(response => response.json())
            .then(data => {
              if (data.message) {
                successMessage.style.display = 'block';
                form.style.display = 'none';
                submitButton.style.display = 'none';
              } else {
                throw new Error(data.error || 'Unknown error');
              }
            })
            .catch(error => {
              errorMessage.textContent = '❌ ' + (error.message || 'Failed to reset password. Please try again.');
              errorMessage.style.display = 'block';
              submitButton.disabled = false;
              submitButton.textContent = 'Reset Password';
            });
          }
        </script>
      </body>
      </html>
    `;
  }
}
