/* */
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { nanoid } from 'nanoid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

/* */
import { UserService } from '#/user/user.service'
import { CustomAuth } from '#/core/entity'

@Injectable()
export default class CustomUserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    @InjectRepository(CustomAuth)
    private readonly customAuthRepository: Repository<CustomAuth>
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<any> {
    if (req.path.includes('/auth/logout')) {
      next()
    }

    const customTokenHeader = this.configService
      .get<string>('customAuth.relayHeader')
      ?.toLowerCase?.()

    const customToken = req.headers[customTokenHeader]

    if (customToken) {
      const requestMethod = this.configService.get<string>(
        'customAuth.requestMethod'
      ) as any

      const requestArgs = {
        url: this.configService.get<string>('customAuth.validateUrl'),
        method: requestMethod
      }

      let response
      if (requestMethod === 'GET') {
        response = await this.httpService
          .request({
            ...requestArgs,
            headers: {
              Authorization: customToken
            }
          })
          .toPromise()
      } else if (requestMethod === 'POST') {
        const template = this.configService.get<string>(
          'customAuth.requestBody'
        )

        const requestBody = JSON.parse(
          template.replace('{{value}}', customToken)
        )
        response = await this.httpService
          .request({
            ...requestArgs,
            data: requestBody
          })
          .toPromise()
      }

      const customId =
        response?.data?.[
          this.configService.get<string>('customAuth.responseUserIdField')
        ]

      if (customId) {
        let auth = await this.customAuthRepository.findOne(customId, {
          relations: ['user']
        })

        if (!auth) {
          const user = await this.userService.create({
            email: null,
            nickname: nanoid(10),
            avatarUrl: ''
          })
          req.user = user

          const customAuth = new CustomAuth()
          customAuth.id = customId
          customAuth.userId = user.id
          await this.customAuthRepository.save(customAuth)
        } else {
          req.user = auth.user
        }
      }
    }

    next()
  }
}
