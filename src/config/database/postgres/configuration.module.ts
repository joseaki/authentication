import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { PostgresConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        TYPEORM_SCHEMA: Joi.string().default('public'),
        TYPEORM_DATABASE: Joi.string().required(),
        TYPEORM_PORT: Joi.number().default(5432),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_SYNCHRONIZE: Joi.string().default(false),
        TYPEORM_MIGRATIONSRUN: Joi.string().default(false),
        TYPEORM_LOGGING: Joi.string().default(false),
        TYPEORM_USEUTC: Joi.boolean().default(true),
      }),
    }),
  ],
  providers: [ConfigService, PostgresConfigService],
  exports: [ConfigService, PostgresConfigService],
})
export class PostgresConfigModule {}
