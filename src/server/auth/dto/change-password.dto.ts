/* */
import { IsNotEmpty, Matches } from 'class-validator'

/* */
import { PASSWORD_REGEXP } from '@/constant'

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string

  @IsNotEmpty()
  @Matches(PASSWORD_REGEXP, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  newPassword: string
}
