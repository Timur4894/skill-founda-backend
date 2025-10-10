import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}
    
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
}
