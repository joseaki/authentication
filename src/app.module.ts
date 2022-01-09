import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'models/auth/auth.module';
import { UsersModule } from 'models/users/users.module';
import { MailerModule } from './models/mailer/mailer.module';
import { ErrorModule } from './error/error.module';

import { PostgresDatabaseProviderModule } from 'providers/database/postgres/provider.module';

@Module({
  imports: [PostgresDatabaseProviderModule, AuthModule, UsersModule, MailerModule, ErrorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
