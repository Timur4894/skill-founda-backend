import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('get-all-users')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('get-user/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('get-me')
  getMe(@Req() req: any) {
    return this.userService.getMe(req.user);
  }

  @Patch('update-me')
  async updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete('delete-me')
  removeMe(@Req() req: any) {
    return this.userService.remove(req.user.id);
  }
}
