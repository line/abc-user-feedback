/* */
import { PickType } from '@nestjs/swagger'

/* */
import { FeedbackResponse } from '#/core/entity'

export class FeedbackResponseDto extends PickType(FeedbackResponse, [
  'id',
  'feedbackId',
  'user',
  'feedbackResponseFields'
] as const) {
  constructor(data) {
    super(data)
  }
}
