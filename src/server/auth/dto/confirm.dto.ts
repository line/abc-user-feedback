/* */
import { IsNotEmpty, IsOptional, Matches } from 'class-validator'

export class ConfirmDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[A-z])(?=.*[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string

  @IsOptional()
  nickname: string = ''

  @IsNotEmpty()
  code: string
}
