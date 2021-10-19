import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'

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
