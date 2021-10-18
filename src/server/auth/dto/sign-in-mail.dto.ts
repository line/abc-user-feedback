import { IsNotEmpty, IsEmail } from 'class-validator'

export class SignInMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
