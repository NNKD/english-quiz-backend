import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.schema';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { ResponseData } from '../../global/response-data';

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
  async register(@Body() createUserDTO: CreateUserDto) {
    return this.userService.register(createUserDTO);
  }
}
