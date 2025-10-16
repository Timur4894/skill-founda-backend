import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendPasswordResetEmail(email: string, newPassword: string): Promise<void> {
    // В реальном приложении здесь будет отправка email через SMTP или email сервис
    // Для разработки просто выводим в консоль
    console.log('='.repeat(50));
    console.log('EMAIL SENT TO:', email);
    console.log('NEW PASSWORD:', newPassword);
    console.log('='.repeat(50));
    
    // Здесь можно добавить реальную отправку email:
    // - через nodemailer
    // - через SendGrid
    // - через AWS SES
    // - через Supabase Edge Functions
  }
}
