import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    example: '',
    description: 'user nickname',
    required: true
  })
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
