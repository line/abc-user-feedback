import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string = ''
}
