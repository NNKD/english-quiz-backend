import { Injectable } from '@nestjs/common';
import env from './config/env';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! ${env().DB_HOST}, ${env().DB_NAME}`;
  }
}
