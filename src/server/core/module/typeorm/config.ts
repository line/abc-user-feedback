import { DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  dotenv.config({
    path: '.env',
    debug: true
  })
}

const mysqlTypeormDatasourceConfig: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DB_CONNECTION_STRING,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/server/database/migrations/*.js'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: ['warn', 'error'],
  migrationsTableName: 'migrations',
  migrationsRun: true
}

export default mysqlTypeormDatasourceConfig
