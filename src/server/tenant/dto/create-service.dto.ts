import { IsString, IsUrl, IsNotEmpty, ValidateIf, IsOptional } from 'class-validator'

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsOptional()
  @IsString()
  description: string = ''

  @ValidateIf((v) => v.logoUrl)
  @IsUrl()
  readonly logoUrl: string
}
