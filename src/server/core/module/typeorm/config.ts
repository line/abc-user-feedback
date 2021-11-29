import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { resolve } from 'path'

const mysqlTypeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  url: process.env.DB_CONNECTION_STRING,
  entities: [resolve(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: ['warn', 'error'],
  migrations: [process.cwd() + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  cli: {
    entitiesDir: resolve(__dirname, '../../core/entity'),
    migrationsDir: process.cwd() + '/migrations'
  }
}

export default mysqlTypeormConfig
