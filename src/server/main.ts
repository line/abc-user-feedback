/* */
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { RenderService } from 'nest-next'

/* */
import { AppModule } from './app.module'
import { PaginatedResultDto } from '#/core/dto'
import ValidationPipe from './core/pipe/validation.pipe'

const PORT = process.env.PORT || 3000

async function main() {
  const app = await NestFactory.create(AppModule)

  // get app config
  const config = app.get<ConfigService>(ConfigService)

  // set swagger document
  const documentConfig = new DocumentBuilder()
    .setTitle('User feedback')
    .setDescription('User feedback API description')
    .setVersion('1.0.0')
    // .addCookieAuth(config.get('jwt.accessToken'), {
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'Token',
    //   in: 'Cookie'
    // })
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'Header' },
      'access-token'
    )
    .build()

  const document = SwaggerModule.createDocument(app, documentConfig, {
    extraModels: [PaginatedResultDto]
  })

  SwaggerModule.setup('docs', app, document)

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
