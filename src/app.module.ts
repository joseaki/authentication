import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import DatabaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from './mailer/mailer.module';
import { ErrorModule } from './error/error.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    AuthModule,
    UsersModule,
    MailerModule,
    ErrorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
