/* */
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

/* */
import mysqlTypeormConfig from './config'

export default TypeOrmModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    ...mysqlTypeormConfig
  }),
  inject: [ConfigService]
})
