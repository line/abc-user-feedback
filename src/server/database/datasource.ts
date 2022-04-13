/* */
import { DataSource } from 'typeorm'

/* */
import mysqlTypeormDatasourceConfig from '#/core/module/typeorm/config'

export const AppDataSource = new DataSource(mysqlTypeormDatasourceConfig)

AppDataSource.initialize()
  .then(async () => {
    console.log('[AppDataSource] success initialize')

    try {
      await AppDataSource.runMigrations()
      console.log('[AppDataSource] success runMigrations')
    } catch (err) {
      console.error('[AppDataSource]', err)
    }
  })
  .catch((err) => {
    console.error('[AppDataSource] failed initialization', err)
    throw err
  })
