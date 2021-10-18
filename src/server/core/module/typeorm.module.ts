import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { resolve } from 'path'

const isProduction = process.env.NODE_ENV === 'production'

export default TypeOrmModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    url: configService.get<string>('database.connectionString'),
    entities: [resolve(__dirname, '../../**/*.entity{.ts,.js}')],
    // synchronize: !isProduction,
    synchronize: true,
    logging: ['warn', 'error'],
    migrations: [resolve(__dirname, '../../migrations/*{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    cli: {
      entitiesDir: resolve(__dirname, '../../core/entity'),
      migrationsDir: resolve(__dirname, '../../migrations')
    }
  }),
  inject: [ConfigService]
})
