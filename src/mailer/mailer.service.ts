import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import EmailConfig from 'src/config/email.config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { CompleteUserInfo, User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor() {}

  private createTransporter() {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     type: 'OAuth2',
    //     user: process.env.MAIL_USERNAME,
    //     pass: process.env.MAIL_PASSWORD,
    //     clientId: process.env.OAUTH_CLIENTID,
    //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //     refreshToken: process.env.OAUTH_REFRESH_TOKEN
    //   }
    // });
    const transporter = nodemailer.createTransport(EmailConfig);
    return transporter;
  }

  private createPasswordRecoveryMessage(
    user: CompleteUserInfo,
    recoveryLink: string,
  ) {
    var source = fs.readFileSync(
      path.join(__dirname, 'templates', 'password-reset.hbs'),
      'utf8',
    );
    var template = handlebars.compile(source);

    const message = {
      from: 'elonmusk@tesla.com', // Sender address
      to: user.email, // List of recipients
      subject: 'Recupera tu contraseña', // Subject line
      html: template({
        name: user.name,
        lastname: user.lastname,
        recoveryLink: recoveryLink,
      }),
    };

    return message;
  }

  private async sendEmail(message: any) {
    try {
      const transport = this.createTransporter();
      const info = await transport.sendMail(message);
      return 'Email sent';
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Error sending email');
    }
  }

  async sendRestorePasswordEmail(user: CompleteUserInfo, recoveryLink: string) {
    const message = this.createPasswordRecoveryMessage(user, recoveryLink);
    return this.sendEmail(message);
  }
}
