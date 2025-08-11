import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<Users[]> {
    return this.userService.getUsers();
  }
}
