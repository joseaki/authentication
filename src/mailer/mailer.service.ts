import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import EmailConfig from 'src/config/email.config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/users/entities/user.entity';
import MailErrorNames from './errors';

@Injectable()
export class MailService {
  private createTransporter() {
    try {
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
    } catch (error) {
      throw new Error(MailErrorNames.TRANSPORTER_ERROR);
    }
  }

  private createPasswordRecoveryMessage(user: User, recoveryLink: string) {
    try {
      const source = fs.readFileSync(
        path.join(__dirname, 'templates', 'password-reset.hbs'),
        'utf8',
      );
      const template = handlebars.compile(source);
      const message = {
        from: 'elonmusk@tesla.com',
        to: user.email,
        subject: 'Recupera tu contraseña',
        html: template({
          name: user.name,
          lastname: user.lastname,
          recoveryLink: recoveryLink,
        }),
      };
      return message;
    } catch (error) {
      throw new Error(MailErrorNames.CREATE_ERROR_MESSAGE);
    }
  }

  private createPasswordRestoredMessage(user: User) {
    try {
      const source = fs.readFileSync(
        path.join(__dirname, 'templates', 'password-update.hbs'),
        'utf8',
      );
      const template = handlebars.compile(source);
      const message = {
        from: 'recovery@password.com',
        to: user.email,
        subject: 'Contraseña cambiada',
        html: template({
          name: user.name,
          lastname: user.lastname,
        }),
      };

      return message;
    } catch (error) {
      throw new Error(MailErrorNames.CREATE_ERROR_MESSAGE);
    }
  }

  private async sendEmail(message: any) {
    try {
      const transport = this.createTransporter();
      return transport.sendMail(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendRestorePasswordEmail(user: User, recoveryLink: string) {
    try {
      const message = this.createPasswordRecoveryMessage(user, recoveryLink);
      return this.sendEmail(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendPasswordRestoredEmail(user: User) {
    try {
      const message = this.createPasswordRestoredMessage(user);
      return this.sendEmail(message);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
