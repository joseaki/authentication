import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import EmailConfig from 'src/config/email.config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/users/entities/user.entity';

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

  private createPasswordRecoveryMessage(user: User, recoveryLink: string) {
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

  private createPasswordRestoredMessage(user: User) {
    var source = fs.readFileSync(
      path.join(__dirname, 'templates', 'password-update.hbs'),
      'utf8',
    );
    var template = handlebars.compile(source);

    const message = {
      from: 'recovery@password.com', // Sender address
      to: user.email, // List of recipients
      subject: 'Contraseña cambiada', // Subject line
      html: template({
        name: user.name,
        lastname: user.lastname,
      }),
    };

    return message;
  }

  private async sendEmail(message: any) {
    try {
      const transport = this.createTransporter();
      return transport.sendMail(message);
    } catch (error) {
      throw new UnprocessableEntityException('Error sending email');
    }
  }

  async sendRestorePasswordEmail(user: User, recoveryLink: string) {
    const message = this.createPasswordRecoveryMessage(user, recoveryLink);
    return this.sendEmail(message);
  }

  async sendPasswordRestoredEmail(user: User) {
    const message = this.createPasswordRestoredMessage(user);
    return this.sendEmail(message);
  }
}
