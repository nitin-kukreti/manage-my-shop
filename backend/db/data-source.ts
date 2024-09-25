import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'citizix_user',
  password: 'S3cret',
  database: 'manage_my_shop',
  entities: ['dist/**/*.model.js'],
  migrations: ['dist/db/migrations/*.js'],
  logging: true,
  poolSize: 10,
};

export const dataSource = new DataSource(dataSourceOption);
