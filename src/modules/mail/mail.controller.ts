import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('send-code')
  async sendMailVerifyCode(@Body('email') email: string) {
    await this.mailService.sendMailVerifyCode(email, 'abc17828');
  }
}
