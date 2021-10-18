import { IsString, IsNotEmpty } from 'class-validator'

export class BindingUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userId: string
}
