/* */
import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Render,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiExcludeController } from '@nestjs/swagger'

/* */
import { ViewService } from './view.service'
import { EmailAuth, Service } from '#/core/entity'
import { UserService } from '#/user/user.service'
import { AuthService } from '#/auth/auth.service'
import { EmailAuthType } from '@/types'
import { PermissionGuard } from '#/core/guard'

@ApiExcludeController()
@Controller()
@UseGuards(PermissionGuard)
export class ViewController {
  constructor(
    private readonly configService: ConfigService,
    private readonly viewService: ViewService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(EmailAuth)
    private readonly emailAuthRepository: Repository<EmailAuth>
  ) {}

  @Get('_next*')
  @Render('*')
  public serve(@Req() req: any) {
    return {}
  }

  @Get(['invite/verify'])
  public async verifyInvitation(
    @Req() req: any,
    @Res() res,
    @Query('code') code: string
  ) {
    const service = req.service
    const config = this.viewService.getClientConfig()

    const emailAuth = await this.authService.checkEmailVerification(
      code,
      EmailAuthType.Invitation
    )

    const viewPath = this.viewService.getViewPath(req.path)

    return res.render(viewPath, {
      service,
      config,
      email: emailAuth.email
    })
  }

  @Get(['reset/password'])
  public async resetPassword(
    @Req() req: any,
    @Res() res,
    @Query('code') code: string
  ) {
    const service = req.service
    const config = this.viewService.getClientConfig()

    const emailAuth = await this.authService.checkEmailVerification(
      code,
      EmailAuthType.PasswordChange
    )

    const viewPath = this.viewService.getViewPath(req.path)

    return res.render(viewPath, {
      service,
      config,
      email: emailAuth.email
    })
  }

  @Get(['sign-in/verify'])
  public async verifySignIn(
    @Req() req: any,
    @Res() res,
    @Query('code') code: string
  ) {
    const emailAuth = await this.authService.checkEmailVerification(
      code,
      EmailAuthType.Register
    )

    const user = await this.userService.getUserByEmail(emailAuth.email)

    if (!user) {
      throw new InternalServerErrorException('error from verify user')
    }

    await this.userService.update(user.id, {
      isVerified: true
    })

    const { accessToken, refreshToken } =
      await this.authService.generateAuthToken({
        userId: user.id
      })

    await this.emailAuthRepository.update(
      { id: emailAuth.id },
      {
        isVerified: true
      }
    )

    this.authService.setCookieWithToken(res, accessToken, refreshToken)

    res.redirect('/')
  }

  @Get(['*'])
  public async setup(@Req() req: any, @Res() res) {
    const service = req.service
    const user = req.user

    const isPageMode = this.configService.get<string>('app.mode') === 'page'

    if (service) {
      if (service.entryPath && service.entryPath !== '/' && req.path === '/') {
        return res.redirect(service.entryPath)
      }

      if (isPageMode) {
        if (!user && req.path !== '/login') {
          return res.redirect('/login')
        }
      }
    } else {
      if (req.path !== '/setup') {
        return res.redirect('/setup')
      }
    }

    let currentUser

    if (user) {
      currentUser = await this.userService.getUserById(user.id)

      if (req.permissions) {
        currentUser.permissions = req.permissions
      }
    }

    const config = this.viewService.getClientConfig()

    const viewPath = this.viewService.getViewPath(req.path)

    return res.render(viewPath, {
      currentUser,
      service,
      config
    })
  }
}
