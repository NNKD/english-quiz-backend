import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import env from '../../config/env';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: env().MAIL_USER,
            pass: env().MAIL_PASS,
          },
        },
        defaults: {
          from: `"No Reply" <${env().MAIL_USER}>`,
        },
        template: {},
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
