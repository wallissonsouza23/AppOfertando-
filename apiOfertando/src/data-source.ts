import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '782501',
  database: 'ofertando',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
