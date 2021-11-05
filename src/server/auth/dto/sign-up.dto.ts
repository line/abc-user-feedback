/* */
import { IsNotEmpty, IsEmail, Matches } from 'class-validator'

/* */
import { PASSWORD_REGEXP } from '@/constant'

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Matches(PASSWORD_REGEXP, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string
}
