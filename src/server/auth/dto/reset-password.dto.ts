/* */
import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

/* */
import { PASSWORD_REGEXP } from '@/constant'

export class SendResetPasswordMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @Matches(PASSWORD_REGEXP, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string

  @IsNotEmpty()
  code: string
}
