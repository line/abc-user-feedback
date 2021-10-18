/* */
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { RenderService } from 'nest-next'

/* */
import { AppModule } from './app.module'
import ValidationPipe from './core/pipe/validation.pipe'

const PORT = process.env.PORT || 3000

async function main() {
  const app = await NestFactory.create(AppModule)

  /**
   * nest-next handled error as next's error renderer (_error page)
   * so intercept api error and handle own response
   */
  const service = app.get(RenderService)

  service.setErrorHandler(async (err, req, res, pathname) => {
    Logger.error(err)
    if (pathname.includes('api')) {
      res.send(err.response)
    } else {
      const path = req.path.replace(/^\/|\/$/g, '').trim()
      res.render(path ?? 'index', err)
    }
  })

  app.use(cookieParser())

  app.useGlobalPipes(ValidationPipe)

  // api start from api/v1 prefix
  // app.setGlobalPrefix('api/v1')

  await app.listen(PORT)

  return app
}

main()
  .then(async (app) => {
    console.log(`Application is running on: ${await app.getUrl()}`)
  })
  .catch((err) => {
    console.error(`Server runtime error`, err)
  })
