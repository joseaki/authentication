import { TypeOrmModule } from '@nestjs/typeorm';

export const msAuthenticationProvider = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'ms-authentication',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
});
