/* */
import { IsNotEmpty, IsEmail, Matches } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Matches(/^(?=.*[A-z])(?=.*[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/, {
    message:
      'password must be 8 and 30 characters long with number, alphabet and special character'
  })
  password: string
}
