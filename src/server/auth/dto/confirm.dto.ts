/* */
import { IsNotEmpty, IsOptional, Matches } from 'class-validator'

/* */
import { PASSWORD_REGEXP } from '@/constant'

export class ConfirmDto {
  @IsNotEmpty()
  @Matches(PASSWORD_REGEXP, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string

  @IsOptional()
  nickname: string = ''

  @IsNotEmpty()
  code: string
}
