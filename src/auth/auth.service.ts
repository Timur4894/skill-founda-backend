import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from 'src/shared/email.service';

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
  
      const newPassword = Math.random().toString(36).slice(-8);
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updatePassword(user.id, hashedPassword);
  
      // Отправляем новый пароль на email
      await this.emailService.sendPasswordResetEmail(email, newPassword);
  
      return { message: 'New password sent to your email' };
    }
}
