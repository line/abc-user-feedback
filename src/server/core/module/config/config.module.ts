/* */
import { ConfigModule } from '@nestjs/config'

/* */
import configuration from '#/config'

const isProduction = process.env.NODE_ENV === 'production'

export default ConfigModule.forRoot({
  validationOptions: {
    abortEarly: true
  },
  ignoreEnvFile: isProduction,
  load: [configuration],
  isGlobal: true
})
