import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeormConfig: TypeOrmModuleOptions = {
  // 타임존옵션을 맨위에안주면 적용이안되는 버그가있음
  // timezone: 'local',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
};
