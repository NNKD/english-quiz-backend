import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseData } from '../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../global/global.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<ResponseData<any>> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        ResponseData.error(
          'User not found!',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        ResponseData.error(
          'Invalid email or password',
          ResponseMessage.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED,
        ),
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const payload = { sub: user._id?.toString(), email: user.email };
    return ResponseData.success(
      await this.jwtService.signAsync(payload),
      'Login successfully',
      ResponseMessage.SUCCESS,
    );
  }
}
