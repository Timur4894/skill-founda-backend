import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('get-all-users')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('get-user/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('get-me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return this.userService.getMe(req);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
