/* */
import { IsEmail, IsNotEmpty, Matches } from 'class-validator'

export class SendResetPasswordMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[A-z])(?=.*[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string

  @IsNotEmpty()
  code: string
}
