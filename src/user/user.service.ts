import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  async findByEmail(email: string){
    const user = await this.userRepository.findOne({where: {email}});
    if(user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  async findByUsernameOrEmail(username: string, email: string) {
    return await this.userRepository.findOne({
      where: [
        { username },
        { email }
      ]
    });
  }

  async getMe(user: any) {
    const currentUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!currentUser) throw new NotFoundException('User not found');
    return currentUser;
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await this.userRepository.update(userId, { password: hashedPassword });
    return { message: 'Password updated successfully' };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) throw new NotFoundException('User not found');

    const password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password });
    return { message: 'Password reset successfully' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return await this.userRepository.save(user);
  }
  

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}
