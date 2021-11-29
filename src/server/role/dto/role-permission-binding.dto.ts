/* */
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

/* */
import { Permission } from '@/types'

export class RolePermissionDto {
  @IsString()
  @IsNotEmpty()
  roleName: string

  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  permission: Permission
}
