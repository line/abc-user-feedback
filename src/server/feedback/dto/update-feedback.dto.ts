/* */
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description: string = ''
}
