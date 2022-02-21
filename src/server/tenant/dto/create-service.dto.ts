import {
  IsString,
  IsUrl,
  IsNotEmpty,
  ValidateIf,
  IsOptional
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string = ''

  @ApiPropertyOptional()
  @ValidateIf((v) => v.logoUrl)
  @IsUrl()
  readonly logoUrl: string
}
