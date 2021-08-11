import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import JWT from 'src/config/jwt.config';

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
