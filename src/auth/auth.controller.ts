import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { RequestWithUser } from './auth.interface';
import { SignInDto } from '../dtos/sign-in.dto';
import { ResponseData } from '../global/response-data';
import { ResponseMessage } from '../global/global.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return ResponseData.success(
      req.user,
      'Successfully logged in',
      ResponseMessage.SUCCESS,
    );
  }
}
