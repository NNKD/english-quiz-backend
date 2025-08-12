import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.schema';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  getUsers(): Promise<Users[]> {
    return this.userService.getUsers();
  }

  @Post('/register')
  register(@Body() createUserDTO: CreateUserDto): Promise<Users | null> {
    return this.userService.register(createUserDTO);
  }
}
