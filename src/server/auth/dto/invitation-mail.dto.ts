/* */
import { IsNotEmpty, IsEmail, IsString } from 'class-validator'

export class InvitationMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  roleName: string
}
