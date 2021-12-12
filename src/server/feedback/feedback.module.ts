/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { FeedbackService } from './feedback.service'
import { FeedbackController } from './feedback.controller'
import {
  Feedback,
  FeedbackField,
  FeedbackFieldOption,
  FeedbackResponse,
  FeedbackResponseField
} from '#/core/entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
      FeedbackField,
      FeedbackResponse,
      FeedbackResponseField,
      FeedbackFieldOption
    ])
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule {}
