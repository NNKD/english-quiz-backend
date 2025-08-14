import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload, RequestWithUser } from './auth.interface';
import { ConfigService } from '@nestjs/config';
import { ResponseData } from '../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../global/global.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        ResponseData.error(
          'Please try to sign in again',
          ResponseMessage.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED,
        ),
        HttpStatusCode.UNAUTHORIZED,
      );
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      request.user = payload;
    } catch {
      throw new HttpException(
        ResponseData.error(
          'Please try to sign in again',
          ResponseMessage.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED,
        ),
        HttpStatusCode.UNAUTHORIZED,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
