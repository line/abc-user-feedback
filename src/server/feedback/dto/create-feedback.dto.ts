/* */
import {
  IsArray,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsAlphanumeric,
  ValidateIf,
  ValidateNested,
  ArrayMinSize,
  IsEnum
} from 'class-validator'
import { Type } from 'class-transformer'

/* */
import { FormFieldType } from '@/types'

export class FeedbackField {
  @IsAlphanumeric()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string = ''

  @IsEnum(FormFieldType)
  @IsNotEmpty()
  type: FormFieldType

  @IsBoolean()
  @IsNotEmpty()
  isRequired: boolean

  @IsNumber()
  @IsNotEmpty()
  order: number

  @ValidateIf((o) => o.type === FormFieldType.Select)
  @IsArray()
  @IsNotEmpty()
  options: Array<{ label: string; value: string }> = []
}

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description: string = ''

  @IsBoolean()
  @IsNotEmpty()
  allowAnonymous: boolean

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => FeedbackField)
  fields: Array<FeedbackField>
}
