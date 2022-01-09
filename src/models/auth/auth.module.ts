import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'models/users/users.module';
import { MailerModule } from 'models/mailer/mailer.module';
import JWT from 'config/jwt.config';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
    PassportModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
