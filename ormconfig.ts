export default {
  type: 'mysql',
  url: process.env.DB_CONNECTION_STRING,
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/server/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/server/database/migrations'
  },
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: ['warn', 'error'],
  migrationsTableName: 'migrations',
  migrationsRun: true
}
