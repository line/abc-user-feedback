/* */
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'

/* */
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      throw new BadRequestException(
        'user not registerd',
        'error.user.not_registerd'
      )
    }

    if (!user.isVerified) {
      throw new BadRequestException(
        'user not verified',
        'error.user.not_verified'
      )
    }

    return user
  }
}
