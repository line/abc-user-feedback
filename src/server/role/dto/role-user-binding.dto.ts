import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class RoleUserDto {
  @IsString()
  @IsNotEmpty()
  roleName: string

  @IsString()
  @IsNotEmpty()
  userId: string
}
