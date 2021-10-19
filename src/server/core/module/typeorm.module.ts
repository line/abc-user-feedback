import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { resolve } from 'path'

export default TypeOrmModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    url: configService.get<string>('database.connectionString'),
    entities: [resolve(__dirname, '../../**/*.entity{.ts,.js}')],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: ['warn', 'error'],
    migrations: [process.cwd() + '/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    cli: {
      entitiesDir: resolve(__dirname, '../../core/entity'),
      migrations: [process.cwd() + '/migrations']
    }
  }),
  inject: [ConfigService]
} as any)
