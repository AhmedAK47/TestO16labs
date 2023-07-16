import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Blog } from '../entity/blog.entity';
import { User } from '../entity/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'abc123',
  database: 'test',
  entities: [User, Blog],
  synchronize: true,
};
