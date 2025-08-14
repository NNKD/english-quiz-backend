import { Body, Controller, Get, HttpException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.schema';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { ResponseData } from '../../global/response-data';
import { UpdateUserNameDto } from '../../dtos/update-user-name.dto';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';
import { yellow } from '@nestjs/common/utils/cli-colors.util';

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

  @Patch('/:id')
  async updateName(@Param('id') id:string, @Body() updateUserNameDto: UpdateUserNameDto) {
    return this.userService.updateNameAfterLogin(id, updateUserNameDto.email, updateUserNameDto.name);
  }

  @Get('/:id')
  async getById(@Param('id') id:string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException(
        ResponseData.error(
          'User not found',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND
      )
    }

    return ResponseData.success(
      user,
      'User found successfully',
      ResponseMessage.SUCCESS
    );
  }
}
