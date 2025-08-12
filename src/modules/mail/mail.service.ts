import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import generateCode from '../../utils/numbers';
import { Users } from '../user/user.schema';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendMailVerifyCode(to: string): Promise<ResponseData<Users | null>> {
    const userSendCode = await this.userService.findByEmail(to);
    const code = userSendCode?.code || '';
    if (code == 'ACTIVED') {
      throw new HttpException(
        ResponseData.error(
          'User already registered',
          ResponseMessage.BAD_REQUEST,
          HttpStatusCode.BAD_REQUEST,
        ),
        HttpStatusCode.BAD_REQUEST,
      );
    }
    try {
      const code = generateCode(6);
      await this.mailerService.sendMail({
        to,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      });
      const user = await this.userService.updateUserCode(to, code);
      return ResponseData.success(
        user,
        'Send mail verification code successfully',
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      console.error(`Failed to send mail`, error);
      throw new HttpException(
        ResponseData.error(
          'Send mail verification code failed',
          ResponseMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        ),
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
