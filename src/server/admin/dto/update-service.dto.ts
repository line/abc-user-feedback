/* */
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* */
import { Locale } from '@/types'

export class UpdateServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string = ''

  @ApiPropertyOptional()
  @IsOptional()
  logoUrl: string

  @ApiPropertyOptional()
  @IsOptional()
  locale: Locale

  @ApiPropertyOptional()
  @IsOptional()
  entryPath: string = '/'

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean = false
}

export class UpdateServiceInvitationDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isRestrictDomain: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { each: true })
  allowDomains: Array<string> = []
}
