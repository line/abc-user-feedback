import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsUrl()
  @IsOptional()
  avatarUrl?: string
}
