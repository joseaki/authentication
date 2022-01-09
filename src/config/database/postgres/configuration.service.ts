import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresConfigService {
  constructor(private configService: ConfigService) {}

  get schema(): string {
    return this.configService.get<string>('postgres.schema');
  }

  get database(): string {
    return this.configService.get<string>('postgres.database');
  }

  get port(): number {
    return this.configService.get<number>('postgres.port');
  }

  get username(): string {
    return this.configService.get<string>('postgres.username');
  }

  get password(): string {
    return this.configService.get<string>('postgres.password');
  }

  get host(): string {
    return this.configService.get<string>('postgres.host');
  }

  get synchronize(): boolean {
    return this.configService.get<boolean>('postgres.synchronize');
  }

  get migrationsRun(): boolean {
    return this.configService.get<boolean>('postgres.migrationsRun');
  }

  get logging(): boolean {
    return this.configService.get<boolean>('postgres.logging');
  }

  get useUTC(): boolean {
    return this.configService.get<boolean>('postgres.useUTC');
  }
}
