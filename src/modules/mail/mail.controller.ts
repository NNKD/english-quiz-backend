import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';

@Controller('mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send-code')
  async sendMailVerifyCode(@Body('email') email: string) {
    const user = await this.mailService.sendMailVerifyCode(email);
    if (user) {
      return ResponseData.success(
        user,
        'Send mail verification code successfully',
        ResponseMessage.SUCCESS,
      );
    } else {
      return ResponseData.error(
        'Send mail verification code failed',
        ResponseMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
