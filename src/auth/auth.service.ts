import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { EmailService } from '../shared/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly userService: UserService,
        private readonly emailService: EmailService
    ) {}
    
    async register(createAuthDto: CreateAuthDto) {
        const existingUser = await this.userService.findByUsernameOrEmail(createAuthDto.username, createAuthDto.email);
          if (existingUser) {
            throw new BadRequestException('Username or email already exists');
          }
          
        const password = await bcrypt.hash(createAuthDto.password, 10);
        const user = await this.userService.create({ ...createAuthDto, password });

   

        const payload = { id: user.id, email: createAuthDto.email, username: createAuthDto.username };
        const token = this.jwtService.sign(payload);

        const { password: _, ...result } = user;
        return { user: result, token };
    }

    async login(loginAuthDto: LoginAuthDto) {
        const user = await this.userService.findByEmail(loginAuthDto.email);
        const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const payload = { id: user.id, email: user.email, username: user.username };
        const token = this.jwtService.sign(payload);

        const { password: _, ...result } = user;
        return { user: result, token };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
      const { email } = resetPasswordDto;
  
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User with this email not found');
      }
  
      // Генерируем токен для сброса пароля
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Токен действителен 1 час
  
      // Сохраняем токен в БД
      await this.userService.updateResetToken(user.id, resetToken, resetTokenExpiry);
  
      // Отправляем письмо с ссылкой для сброса пароля
      await this.emailService.sendPasswordResetEmail(email, resetToken);
  
      return { message: 'Password reset link sent to your email' };
    }

    async resetPasswordWithToken(resetPasswordWithTokenDto: ResetPasswordWithTokenDto) {
      const { token, newPassword } = resetPasswordWithTokenDto;
  
      // Находим пользователя по токену
      const user = await this.userService.findByResetToken(token);
      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }
  
      // Проверяем срок действия токена
      if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
        throw new BadRequestException('Reset token has expired');
      }
  
      // Хешируем новый пароль
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Обновляем пароль и очищаем токен
      await this.userService.updatePassword(user.id, hashedPassword);
      await this.userService.clearResetToken(user.id);
  
      return { message: 'Password has been reset successfully' };
    }
}
