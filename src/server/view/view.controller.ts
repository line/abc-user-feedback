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
/* */
import { ViewService } from './view.service'
import { EmailAuth, Service } from '#/core/entity'
import { UserService } from '#/user/user.service'
import { AuthService } from '#/auth/auth.service'
import { Roles } from '#/core/decorators'
import { EmailAuthType, UserRole } from '@/types'
import { RoleGuard } from '#/core/guard'

@Controller()
@UseGuards(RoleGuard)
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

    if (!service && req.path !== '/setup') {
      return res.redirect('/setup')
    }

    if (
      !user &&
      this.configService.get<boolean>('auth.redirectToLoginPage') &&
      req.path !== '/login'
    ) {
      return res.redirect('/login')
    }

    let currentUser

    if (user) {
      currentUser = await this.userService.getUserById(user.id)
    }

    const config = this.viewService.getClientConfig()

    const viewPath = this.viewService.getViewPath(req.path)

    return res.render(viewPath, {
      currentUser,
      service,
      config
    })
  }

  @Get(['admin/*'])
  @Roles(UserRole.Owner, UserRole.Admin)
  public async setupWithAdmin(@Req() req: any, @Res() res) {
    await this.setup(req, res)
  }
}
