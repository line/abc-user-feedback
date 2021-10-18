import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator'

export class CreateFeedbackResponseDto {
  @ValidateNested({ each: true })
  @IsObject()
  @IsNotEmpty()
  response: Record<string, any>
}
