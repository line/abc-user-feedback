/* */
import { IsNotEmpty, IsEmail, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional()
  @IsBoolean()
  rememberEmail: boolean = false
}
