/* */
import { PickType } from '@nestjs/swagger'

/* */
import { Feedback } from '#/core/entity'

export class FeedbackDto extends PickType(Feedback, [
  'id',
  'code',
  'title',
  'allowAnonymous',
  'description',
  'createdTime',
  'updatedTime',
  'user',
  'fields'
] as const) {}
