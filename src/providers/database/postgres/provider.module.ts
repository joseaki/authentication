import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigService } from 'config/database/postgres/configuration.service';
import { PostgresConfigModule } from 'config/database/postgres/configuration.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfigService: PostgresConfigService) => ({
        type: 'postgres',
        schema: postgresConfigService.schema,
        database: postgresConfigService.database,
        port: postgresConfigService.port,
        username: postgresConfigService.username,
        password: postgresConfigService.password,
        host: postgresConfigService.host,
        synchronize: postgresConfigService.synchronize,
        migrationsRun: postgresConfigService.migrationsRun,
        logging: false,
        useUTC: postgresConfigService.useUTC,
        cli: { migrationsDir: 'src/database/migrations' },
        migrations: ['dist/migrations/**/*{.ts,.js}'],
        entities: ['dist/**/*.entity{.ts,.js}'],
      }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
