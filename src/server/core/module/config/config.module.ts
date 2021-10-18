/* */
import { ConfigModule } from '@nestjs/config'

/* */
import configuration from '#/config'

export default ConfigModule.forRoot({
  validationOptions: {
    abortEarly: true
  },
  ignoreEnvFile: true,
  load: [configuration],
  isGlobal: true
})
