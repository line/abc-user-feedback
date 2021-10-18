/* */
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

/* */
import { AuthService } from '#/auth/auth.service'
import { User } from '#/core/entity'

@Injectable()
export default class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<any> {
    if (req.path.includes('/auth/logout')) {
      next()
    }

    const domain = this.authService.getCookieDomain()

    let accessToken =
      req.cookies[this.configService.get<string>('jwt.accessToken')]

    if (!accessToken) {
      const { authorization } = req.headers
      accessToken = authorization?.split(' ')?.pop?.()
    }

    if (accessToken) {
      try {
        const decoded = await this.authService.decodeToken<any>(accessToken)
        const user = await this.userRepository.findOne(decoded.userId)

        if (!user) {
          throw new BadRequestException('error fom access token')
        }

        req.user = user
        return next()
      } catch (err) {
        res.cookie(this.configService.get<string>('jwt.accessToken'), '', {
          domain,
          maxAge: 0
        })
        req.user = null
      }
    }

    const originRefreshToken =
      req.cookies[this.configService.get<string>('jwt.refreshToken')]

    if (!originRefreshToken) {
      return next()
    } else {
      try {
        const decoded = await this.authService.decodeToken<any>(
          originRefreshToken
        )

        const { accessToken, refreshToken } =
          await this.authService.refreshAuthToken(
            decoded.exp,
            decoded.userId,
            originRefreshToken
          )

        const user = await this.userRepository.findOne(decoded.userId)
        req.user = user

        if (!user) {
          throw new BadRequestException('error fom access token')
        }

        this.authService.setCookieWithToken(res, accessToken, refreshToken)
      } catch {
        res.cookie(this.configService.get<string>('jwt.refreshToken'), '', {
          domain,
          maxAge: 0
        })

        return next()
      }
    }

    next()
  }
}
