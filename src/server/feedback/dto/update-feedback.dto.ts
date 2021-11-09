/* */
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator'

/* */
import { FEEDBACK_CODE_REGEXP } from '@/constant'

export class UpdateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description: string = ''

  @IsString()
  @Matches(FEEDBACK_CODE_REGEXP)
  code: string
}
