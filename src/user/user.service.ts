import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  async findOne(id: number) {
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

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return this.userRepository.update(id, updateUserDto);
  // }

  // remove(id: number) {
  //   return this.userRepository.delete(id);
  // }
}
