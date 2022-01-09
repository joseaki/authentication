import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  schema: process.env.TYPEORM_SCHEMA,
  database: process.env.TYPEORM_DATABASE,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  host: process.env.TYPEORM_HOST,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  migrationsRun: process.env.TYPEORM_MIGRATIONSRUN,
  logging: process.env.TYPEORM_LOGGING,
  useUTC: process.env.TYPEORM_USEUTC,
}));
