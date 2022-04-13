/* */
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

/* */
import mysqlTypeormDatasourceConfig from './config'
import { AppDataSource } from '#/database/datasource'

export default TypeOrmModule.forRootAsync({
  connectionFactory: async (options) => {
    return AppDataSource
  },
  useFactory: async (configService: ConfigService) => {
    return {
      ...mysqlTypeormDatasourceConfig
    }
  },
  inject: [ConfigService]
})
