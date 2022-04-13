/* */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'
import { Repository } from 'typeorm'
import { Response } from 'express'
import { nanoid } from 'nanoid'
import { google } from 'googleapis'
import * as jwt from 'jsonwebtoken'
import qs from 'querystring'
import * as bcrypt from 'bcrypt'
import { DateTime } from 'luxon'

/* */
import { Account, EmailAuth, Service, User } from '#/core/entity'
import {
  ChangePasswordDto,
  ConfirmDto,
  InvitationMailDto,
  ResetPasswordDto,
  SendResetPasswordMailDto,
  SignUpDto
} from './dto'
import { checkFileExists } from '#/utils/file'
import { UserProfile } from '#/core/entity/userProfile.entity'
import { UserService } from '#/user/user.service'
import { EmailAuthType } from '@/types'

interface Token {
  accessToken: string
  refreshToken: string
}

const lineSocialUri =
  process.env.NODE_ENV === 'production'
    ? 'https://access.line.me'
    : 'https://access.line-beta.me'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(EmailAuth)
    private readonly emailAuthRepository: Repository<EmailAuth>,
    private readonly mailerService: MailerService
  ) {}

  getCookieDomain(): string | undefined {
    const domain = this.configService.get<string>('app.domain')
    const urlObject = new URL(domain)
    const hostName = urlObject.hostname

    return process.env.NODE_ENV === 'production' ? `.${hostName}` : undefined
  }

  setCookieWithToken(res: Response, accessToken: string, refreshToken: string) {
    const domain = this.getCookieDomain()

    res.cookie(this.configService.get<string>('jwt.accessToken'), accessToken, {
      domain,
      maxAge: 60 * 60 * 1000
    })

    res.cookie(
      this.configService.get<string>('jwt.refreshToken'),
      refreshToken,
      { domain, maxAge: 60 * 60 * 24 * 7 * 1000 }
    )
  }

  clearCookie(res: Response) {
    const domain = this.getCookieDomain()

    res.cookie(this.configService.get<string>('jwt.accessToken'), '', {
      domain,
      maxAge: 0
    })

    res.cookie(this.configService.get<string>('jwt.refreshToken'), '', {
      domain,
      maxAge: 0
    })
  }

  async localRegisterUser(data: SignUpDto): Promise<any> {
    const [service] = await this.serviceRepository.find()

    // if private service, only user can register from invitation
    if (service && service.isPrivate) {
      throw new BadRequestException(
        'user can register from invitation in private service'
      )
    }

    const user = await this.userService.getUserByEmail(data.email)

    if (user) {
      throw new BadRequestException('user already registerd')
    }

    if (service && service.isRestrictDomain) {
      const mailDomain = data.email.split('@')[1]
      if (!service.allowDomains.includes(mailDomain)) {
        throw new BadRequestException(`${mailDomain} is not allowed domain`)
      }
    }

    await this.userService.create(
      {
        email: data.email,
        nickname: data.email.split('@')[0],
        avatarUrl: ''
      },
      { password: data.password }
    )

    await this.sendRegisterVerifyMail(data.email)
  }

  async checkEmailVerification(
    code: string,
    type: EmailAuthType
  ): Promise<EmailAuth> {
    const emailAuth = await this.emailAuthRepository.findOne({
      where: {
        code
      }
    })

    if (!emailAuth) {
      throw new BadRequestException('code is not corrected')
    }

    if (emailAuth.isVerified) {
      throw new BadRequestException('code already used or expired')
    }

    if (emailAuth.type !== type) {
      throw new BadRequestException('link has some trouble')
    }

    const createdTime = DateTime.fromJSDate(emailAuth.createdTime)
    const diffs = createdTime.diffNow('hours')

    if (diffs.hours <= -24) {
      throw new BadRequestException('code expired')
    }

    return emailAuth
  }

  async confirmRegisterUser(data: ConfirmDto): Promise<User> {
    const emailAuth = await this.checkEmailVerification(
      data.code,
      EmailAuthType.Invitation
    )

    if (await this.userService.getUserByEmail(emailAuth.email)) {
      throw new BadRequestException('user already registerd')
    }

    await this.emailAuthRepository.update(
      { id: emailAuth.id },
      {
        isVerified: true
      }
    )

    const user = await this.userService.create(
      {
        email: emailAuth.email,
        nickname: data.nickname,
        avatarUrl: ''
      },
      { withVerify: true, password: data.password, role: emailAuth.asRole }
    )

    return user
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const { currentPassword, newPassword } = data

    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      select: {
        id: true,
        hashPassword: true
      }
    })

    if (!user) {
      throw new InternalServerErrorException()
    }

    const compared = await bcrypt.compare(currentPassword, user.hashPassword)

    if (!compared) {
      throw new BadRequestException(
        'password not correct',
        'error.password.not_correct'
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    await this.userRepository.update(user.id, {
      hashPassword
    })
  }

  async resetPassword(data: ResetPasswordDto) {
    const { password, code } = data

    const emailAuth = await this.checkEmailVerification(
      code,
      EmailAuthType.PasswordChange
    )

    const user = await this.userService.getUserByEmail(emailAuth.email)

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    await this.emailAuthRepository.update(
      { id: emailAuth.id },
      {
        isVerified: true
      }
    )

    await this.userRepository.update(user.id, {
      hashPassword
    })

    return user
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        hashPassword: true,
        email: true,
        isVerified: true
      }
    })

    if (user) {
      const account = await this.accountRepository.findOne({
        where: {
          userId: user.id
        }
      })

      if (account) {
        throw new BadRequestException(
          `user ${email} was not sign-up from password. try login with other way`
        )
      }

      const compared = await bcrypt.compare(password, user.hashPassword)

      if (!compared) {
        throw new BadRequestException(
          'email or password not correct',
          'error.auth.not_correct'
        )
      }

      user.hashPassword = ''
      return user
    }

    return null
  }

  async generateAuthToken(payload, options?: jwt.SignOptions): Promise<Token> {
    const tokenSecret = this.configService.get<string>('jwt.secret')

    const accessToken = jwt.sign(payload, tokenSecret, {
      issuer: this.configService.get<string>('app.domain'),
      expiresIn: '1h',
      subject: 'access_token',
      ...options
    })

    const refreshToken = jwt.sign(payload, tokenSecret, {
      issuer: this.configService.get<string>('app.domain'),
      expiresIn: '7d',
      subject: 'refresh_token',
      ...options
    })

    if (!accessToken) {
      throw new InternalServerErrorException('error from generate token')
    }

    return { accessToken, refreshToken }
  }

  async refreshAuthToken(
    refreshTokenExp: number,
    userId: string,
    _refreshToken: string
  ): Promise<Token> {
    let refreshToken = _refreshToken

    const tokenSecret = this.configService.get<string>('jwt.secret')

    const now = new Date().getTime()
    const diff = +refreshTokenExp * 1000 - now

    const payload = {
      userId
    }

    if (diff < 60 * 60 * 24 * 1000 * 4) {
      refreshToken = jwt.sign(payload, tokenSecret, {
        issuer: this.configService.get<string>('app.domain'),
        expiresIn: '7d',
        subject: 'refresh_token'
      })
    }

    const accessToken = jwt.sign(payload, tokenSecret, {
      issuer: this.configService.get<string>('app.domain'),
      expiresIn: '1h',
      subject: 'access_token'
    })

    return { accessToken, refreshToken }
  }

  async decodeToken<T>(token: string): Promise<T> {
    const secret = this.configService.get<string>('jwt.secret')
    const decoded = (await jwt.verify(token, secret)) as T

    if (!decoded) {
      throw new InternalServerErrorException()
    }

    return decoded
  }

  getCallbackTarget(provider: string): string {
    const domain = this.configService.get<string>('app.domain')

    return `${domain}/api/v1/auth/callback/${provider}`
  }

  generateLink(provider, next = '/'): string {
    let targetUrl = ''

    if (provider === 'google') {
      const callback = this.getCallbackTarget('google')

      const googleAuthClient = new google.auth.OAuth2(
        this.configService.get<string>('oauth.google.clientId'),
        this.configService.get<string>('oauth.google.clientSecret'),
        callback
      )

      targetUrl = googleAuthClient.generateAuthUrl({
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
        state: JSON.stringify({ next })
      })
    } else if (provider === 'line') {
      const callback = this.getCallbackTarget('line')

      const params = qs.stringify({
        scope: 'profile openid',
        client_id: this.configService.get<string>('oauth.line.clientId'),
        redirect_uri: callback,
        response_type: 'code',
        state: JSON.stringify({ next })
      })

      targetUrl = `${lineSocialUri}/oauth2/v2.1/authorize?${params}`
    }

    return targetUrl
  }

  async getGoogleAccessToken(code: string) {
    const callback = this.getCallbackTarget('google')

    const googleAuthClient = new google.auth.OAuth2(
      this.configService.get<string>('oauth.google.clientId'),
      this.configService.get<string>('oauth.google.clientSecret'),
      callback
    )

    const { tokens } = await googleAuthClient.getToken(code)
    const { access_token } = tokens

    if (!access_token) {
      throw new BadRequestException('error from get google access token')
    }

    return access_token
  }

  async getGoogleProfile(accessToken: string) {
    const { people } = google.people('v1')
    const profile = await people.get({
      access_token: accessToken,
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos'
    })

    const { data } = profile

    const email = data.emailAddresses![0].value
    const name = data.names![0].displayName || 'user'
    const avatar = data.photos![0].url
    const providerKey = data.resourceName!.replace('people/', '')

    return {
      email,
      name,
      avatar,
      providerKey
    }
  }

  async getAccountInfo(provider: string, providerKey: string) {
    const account = await this.accountRepository.findOne({
      where: {
        provider,
        providerKey
      }
    })

    return account
  }

  async googleCallback(code: string): Promise<any> {
    const googleAccessToken = await this.getGoogleAccessToken(code)

    if (!googleAccessToken) {
      return
    }

    const profile = await this.getGoogleProfile(googleAccessToken)

    if (!profile) {
      return
    }

    const accountInfo = await this.getAccountInfo('google', profile.providerKey)

    let user
    if (accountInfo) {
      user = await this.userRepository.findOne({
        where: { id: accountInfo.userId }
      })

      if (!user) {
        throw new BadRequestException()
      }
    } else {
      // if account not exist, register new account and user with provider
      // but reject create user when service is private
      const [serivce] = await this.serviceRepository.find()

      if (serivce && serivce.isPrivate) {
        throw new BadRequestException('user is not invited')
      }

      user = await this.userService.create(
        {
          email: profile.email,
          nickname: profile.name,
          avatarUrl: profile.avatar
        },
        { withVerify: true }
      )

      const account = new Account()
      account.userId = user.id
      account.provider = 'google'
      account.providerKey = profile.providerKey
      await this.accountRepository.save(account)
    }

    const { accessToken, refreshToken } = await this.generateAuthToken({
      userId: user.id
    })

    return { accessToken, refreshToken }
  }

  async sendRegisterVerifyMail(email: string) {
    const domain = this.configService.get<string>('app.domain')

    const emailAuth = new EmailAuth()
    const randomCode = nanoid()
    emailAuth.email = email
    emailAuth.code = randomCode
    emailAuth.type = EmailAuthType.Register

    await this.emailAuthRepository.save(emailAuth)

    const isCustomTemplateExist = await checkFileExists(
      process.cwd() + '/etc/signIn.hbs'
    )

    const template = isCustomTemplateExist
      ? process.cwd() + '/etc/signIn'
      : process.cwd() + '/template/signIn'

    await this.mailerService.sendMail({
      to: email,
      subject: `Register to user feedback`,
      context: {
        link: `${domain}/sign-in/verify?code=${randomCode}`,
        purpose: 'Register'
      },
      template
    })
  }

  async sendResetPasswordMail(data: SendResetPasswordMailDto) {
    const { email } = data

    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: {
        hashPassword: true
      }
    })

    if (!user) {
      throw new BadRequestException('user not registered with this email')
    }

    if (!user.hashPassword) {
      throw new BadRequestException('user not register from password type')
    }

    const emailAuth = new EmailAuth()
    const randomCode = nanoid()

    emailAuth.email = email
    emailAuth.code = randomCode
    emailAuth.type = EmailAuthType.PasswordChange

    await this.emailAuthRepository.save(emailAuth)

    const domain = this.configService.get<string>('app.domain')

    const link = `${domain}/reset/password?code=${randomCode}`

    const isCustomTemplateExist = await checkFileExists(
      process.cwd() + '/etc/resetPassword.hbs'
    )

    const template = isCustomTemplateExist
      ? process.cwd() + '/etc/resetPassword'
      : process.cwd() + '/template/resetPassword'

    await this.mailerService.sendMail({
      to: email,
      subject: `User feedback Reset password`,
      context: {
        link
      },
      template
    })
  }

  async sendInvitationMail(data: InvitationMailDto) {
    const { email, roleName } = data

    const [service] = await this.serviceRepository.find()

    if (service && service.isRestrictDomain) {
      const mailDomain = data.email.split('@')[1]
      if (!service.allowDomains.includes(mailDomain)) {
        throw new BadRequestException(`${mailDomain} is not allowed domain`)
      }
    }

    const domain = this.configService.get<string>('app.domain')

    const user = await this.userRepository.findOne({
      where: {
        email
      }
    })

    if (user) {
      throw new BadRequestException(
        'user already registered',
        'error.user.already_registerd'
      )
    }

    // expire previous invitation mail
    await this.emailAuthRepository
      .createQueryBuilder()
      .update()
      .set({
        isVerified: true
      })
      .where(`email = :email AND type = :type`, {
        email,
        type: EmailAuthType.Invitation
      })
      .execute()

    const emailAuth = new EmailAuth()
    const randomCode = nanoid()
    emailAuth.email = email
    emailAuth.code = randomCode
    emailAuth.asRole = roleName
    emailAuth.type = EmailAuthType.Invitation

    await this.emailAuthRepository.save(emailAuth)

    const link = `${domain}/invite/verify?code=${randomCode}`

    const isCustomTemplateExist = await checkFileExists(
      process.cwd() + '/etc/invitation.hbs'
    )

    const template = isCustomTemplateExist
      ? process.cwd() + '/etc/invitation'
      : process.cwd() + '/template/invitation'

    await this.mailerService.sendMail({
      to: email,
      subject: `User Feedback Invitation`,
      context: {
        link,
        service
      },
      template
    })
  }
}
