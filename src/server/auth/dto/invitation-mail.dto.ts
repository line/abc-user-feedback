/* */
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator'

/* */
import { UserRole } from '@/types'

export class InvitationMailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole
}
