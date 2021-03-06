/* */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ApiTags, ApiBody, ApiExcludeEndpoint } from '@nestjs/swagger'

/* */
import { AuthService } from './auth.service'
import {
  ChangePasswordDto,
  ConfirmDto,
  InvitationMailDto,
  ResetPasswordDto,
  SendResetPasswordMailDto,
  SignUpDto,
  SignInDto
} from './dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions } from '#/core/decorators'
import { Permission } from '@/types'

@ApiTags('Auth')
@Controller('api/v1')
@UseGuards(PermissionGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @ApiBody({ type: SignInDto })
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req, @Res() res: Response, @Body() data: SignInDto) {
    const user = req.user

    const { email, rememberEmail } = data

    if (rememberEmail) {
      res.cookie('loginMail', email)
    } else {
      res.cookie('loginMail', '', {
        maxAge: 0
      })
    }

    const { accessToken, refreshToken } =
      await this.authService.generateAuthToken({
        userId: user.id
      })

    this.authService.setCookieWithToken(res, accessToken, refreshToken)

    res.status(204).end()
  }

  @ApiBody({ type: SignUpDto })
  @Post('auth/register')
  async signUp(@Req() req, @Res() res: Response, @Body() data: SignUpDto) {
    await this.authService.localRegisterUser(data)
    res.status(204).end()
  }

  @Post('auth/confirm')
  async confirm(@Req() req, @Res() res: Response, @Body() data: ConfirmDto) {
    const user = await this.authService.confirmRegisterUser(data)

    const { accessToken, refreshToken } =
      await this.authService.generateAuthToken({
        userId: user.id
      })

    this.authService.setCookieWithToken(res, accessToken, refreshToken)

    return res.status(204).end()
  }

  @ApiBody({ type: ChangePasswordDto })
  @Post('auth/password')
  async changePassword(
    @Req() req,
    @Res() res: Response,
    @Body() data: ChangePasswordDto
  ) {
    const user = req.user

    if (!user) {
      throw new UnauthorizedException()
    }

    await this.authService.changePassword(user.id, data)

    return res.status(204).end()
  }

  @ApiBody({ type: ResetPasswordDto })
  @Post('auth/password/reset')
  async resetPassword(@Res() res: Response, @Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data)

    return res.status(204).end()
  }

  @ApiExcludeEndpoint()
  @Get('auth/redirect/:provider')
  authRedirect(
    @Res() res: Response,
    @Param('provider') provider: string,
    @Query('next') next: string
  ) {
    if (!provider) {
      throw new BadRequestException('missing provider')
    }

    const targetUrl = this.authService.generateLink(provider, next)

    res.redirect(targetUrl)
  }

  @ApiExcludeEndpoint()
  @Get('auth/callback/:provider')
  async handleCallback(
    @Res() res: Response,
    @Param('provider') provider,
    @Query('code') code
  ) {
    if (!code) {
      throw new BadRequestException('missing code')
    }

    if (provider === 'google') {
      const { accessToken, refreshToken } =
        await this.authService.googleCallback(code)

      this.authService.setCookieWithToken(res, accessToken, refreshToken)
    } else if (provider === 'line') {
      // this.authService.lineCallback(code)
    }

    const domain = this.configService.get<string>('app.domain')

    const redirectUrl =
      process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : domain

    res.redirect(redirectUrl)
  }

  @ApiBody({ type: SendResetPasswordMailDto })
  @Post('auth/mail/reset-password')
  async sendResetPasswordMail(
    @Res() res: Response,
    @Body() data: SendResetPasswordMailDto
  ) {
    await this.authService.sendResetPasswordMail(data)

    res.status(204).end()
  }

  @ApiBody({ type: InvitationMailDto })
  @Post('admin/auth/mail/invitation')
  @Permissions(Permission.INVITE_USER)
  async sendInvitationMail(
    @Res() res: Response,
    @Body() data: InvitationMailDto
  ) {
    await this.authService.sendInvitationMail(data)

    res.status(204).end()
  }

  @Post('auth/logout')
  async handleLogout(@Res() res: Response) {
    const domain = this.authService.getCookieDomain()

    res.cookie(this.configService.get<string>('jwt.accessToken'), '', {
      domain,
      maxAge: 0
    })
    res.cookie(this.configService.get<string>('jwt.refreshToken'), '', {
      domain,
      maxAge: 0
    })

    res.status(204).end()
  }
}
