/* */
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'

/* */
import { Locale } from '@/types'

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  description: string = ''

  @IsOptional()
  logoUrl: string

  @IsOptional()
  locale: Locale

  @IsOptional()
  entryPath: string = '/'

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean = false
}

export class UpdateServiceInvitationDto {
  @IsBoolean()
  @IsNotEmpty()
  isRestrictDomain: boolean

  @IsOptional()
  @IsUrl({}, { each: true })
  allowDomains: Array<string> = []
}
