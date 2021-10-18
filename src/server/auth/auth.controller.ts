/* */
import {
  Controller,
  Query,
  Param,
  Res,
  Req,
  Get,
  Post,
  BadRequestException,
  Body,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

/* */
import { AuthService } from './auth.service'
import {
  ResetPasswordDto,
  InvitationMailDto,
  SignUpDto,
  ConfirmDto,
  SendResetPasswordMailDto
} from './dto'
import { RoleGuard } from '#/core/guard'
import { Roles } from '#/core/decorators'
import { UserRole } from '@/types'

@Controller('api/v1')
@UseGuards(RoleGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() req, @Res() res: Response) {
    const user = req.user

    const { accessToken, refreshToken } =
      await this.authService.generateAuthToken({
        userId: user.id
      })

    this.authService.setCookieWithToken(res, accessToken, refreshToken)

    res.status(204).end()
  }

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

  @Post('auth/reset/password')
  async resetPassword(@Res() res: Response, @Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data)

    return res.status(204).end()
  }

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

  @Post('auth/mail/reset-password')
  async sendResetPasswordMail(
    @Res() res: Response,
    @Body() data: SendResetPasswordMailDto
  ) {
    await this.authService.sendResetPasswordMail(data)

    res.status(204).end()
  }

  @Post('admin/auth/mail/invitation')
  @Roles(UserRole.Admin)
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
