import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailVerifyCode(to: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      });
    } catch (error) {
      console.error(`Failed to send mail`, error);
    }
  }
}
