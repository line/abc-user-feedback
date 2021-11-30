const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  type: 'mysql',
  url: process.env.DB_CONNECTION_STRING,
  entities: [isProduction ? 'dist/**/**.entity.js' : 'src/**/**.entity.ts'],
  migrations: [
    isProduction
      ? 'dist/server/database/migrations/*.js'
      : 'src/server/database/migrations/*.ts'
  ],
  cli: {
    migrationsDir: isProduction
      ? 'dist/server/database/migrations'
      : 'src/server/database/migrations'
  },
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: ['warn', 'error'],
  migrationsTableName: 'migrations',
  migrationsRun: true
}
