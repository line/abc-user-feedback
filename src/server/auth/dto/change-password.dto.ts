/* */
import { IsNotEmpty, Matches } from 'class-validator'

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string

  @IsNotEmpty()
  @Matches(/^(?=.*[A-z])(?=.*[0-9]).{8,20}$/, {
    message:
      'password must be 8 and 20 characters long with number and alphabet'
  })
  newPassword: string
}
