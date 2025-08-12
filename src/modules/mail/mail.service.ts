import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import generateCode from '../../utils/numbers';
import { Users } from '../user/user.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendMailVerifyCode(to: string): Promise<Users | null> {
    try {
      const code = generateCode(6);
      await this.mailerService.sendMail({
        to,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      });
      return await this.userService.updateUserCode(to, code);
    } catch (error) {
      console.error(`Failed to send mail`, error);
      return null;
    }
  }
}
