/* */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, getManager, Repository } from 'typeorm'
import { nanoid } from 'nanoid'
/* */
import {
  CreateFeedbackDto,
  CreateFeedbackResponseDto,
  UpdateFeedbackDto
} from './dto'
import {
  Feedback,
  FeedbackField,
  FeedbackResponse,
  FeedbackResponseField,
  User
} from '#/core/entity'
import { FormFieldType } from '@/types'

@Injectable()
export class FeedbackService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(FeedbackField)
    private readonly feedbackFieldRepository: Repository<FeedbackField>,
    @InjectRepository(FeedbackResponse)
    private readonly feedbackResponseRepository: Repository<FeedbackResponse>,
    @InjectRepository(FeedbackResponseField)
    private readonly feedbackResponseFieldRepository: Repository<FeedbackResponseField>
  ) {}

  async createFeedback(data: CreateFeedbackDto, userId: string) {
    const feedback = new Feedback()

    feedback.userId = userId
    feedback.code = nanoid(6)
    feedback.title = data.title
    feedback.allowAnonymous = data.allowAnonymous
    feedback.description = data.description

    await this.feedbackRepository.save(feedback)

    const fields = data.fields.map((field) => {
      const feedbackField = new FeedbackField()
      feedbackField.name = field.name
      feedbackField.description = field.description
      feedbackField.type = field.type
      feedbackField.isRequired = field.isRequired
      feedbackField.order = field.order
      feedbackField.feedbackId = feedback.id
      feedbackField.option = field.option
      return feedbackField
    })

    await this.feedbackFieldRepository.save(fields)

    feedback.fields = fields

    return feedback
  }

  async updateFeedback(idOrCode: string, data: UpdateFeedbackDto) {
    const feedback = await this.findFeedback(idOrCode)

    if (!feedback) {
      throw new NotFoundException()
    }

    await this.feedbackRepository.update(feedback.id, {
      title: data.title,
      description: data.description
    })

    return feedback
  }

  async findAllFeedback(offset: number, limit: number) {
    const feedbacks = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoin('feedback.user', 'user')
      .addSelect('user.id')
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nickname')
      .leftJoinAndSelect('feedback.responses', 'responses')
      .loadRelationCountAndMap('feedback.responses', 'feedback.responses')
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    return feedbacks
  }

  async findById(id: string) {
    const feedback = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.id = :id', { id })
      .leftJoinAndSelect('feedback.fields', 'fields')
      .leftJoin('feedback.user', 'user')
      .addSelect('user.id')
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nickname')
      .getOne()

    return feedback
  }

  async findByCode(code: string) {
    const feedback = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.code = :code', { code })
      .leftJoinAndSelect('feedback.fields', 'fields')
      .leftJoin('feedback.user', 'user')
      .addSelect('user.id')
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nickname')
      .getOne()

    return feedback
  }

  async findFeedback(idOrCode: string): Promise<Feedback> {
    let feedback
    if (idOrCode.length === 6) {
      feedback = await this.findByCode(idOrCode)
    } else {
      feedback = await this.findById(idOrCode)
    }

    return feedback
  }

  validateResponse(
    response: Record<string, any>,
    fields: Array<FeedbackField>
  ): boolean {
    const dataKeys = Object.keys(response)

    dataKeys.map((key) => {
      const targetField = fields.find((field) => field.name === key)
      if (!targetField) {
        throw new BadRequestException(`unexpected field ${key}`)
      }
    })

    fields.map((field) => {
      const { isRequired, name, type } = field
      const value = response?.[name]
      if (isRequired && !value) {
        throw new BadRequestException(`${name} is required`)
      }

      if (type === FormFieldType.Select && !field.option.includes(value)) {
        throw new BadRequestException(`${name} not allow value ${value}`)
      }
    })

    return true
  }

  async createResponse(
    data: Record<string, any>,
    feedback: Feedback,
    userId: string | undefined
  ) {
    this.validateResponse(data, feedback.fields)

    const feedbackResponse = new FeedbackResponse()
    feedbackResponse.feedbackId = feedback.id
    feedbackResponse.userId = userId

    await this.feedbackResponseRepository.save(feedbackResponse)

    const responseFields = feedback.fields.map((field) => {
      const feedbackResponseField = new FeedbackResponseField()
      feedbackResponseField.feedbackResponseId = feedbackResponse.id
      feedbackResponseField.feedbackFieldId = field.id
      feedbackResponseField.value = data[field.name]

      return feedbackResponseField
    })

    await this.feedbackResponseFieldRepository.save(responseFields)

    return feedbackResponse
  }

  async getResponses(
    feedbackId: string,
    offset: number,
    limit?: number,
    query?: Record<string, any>
  ) {
    let queryBuilder = this.feedbackResponseRepository
      .createQueryBuilder('response')
      .where('response.feedbackId = :feedbackId', { feedbackId })
      .leftJoin('response.user', 'user')
      .addSelect('user.id')
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nickname')
      .leftJoin('response.feedbackResponseFields', 'feedbackResponseFields')
      .leftJoin('feedbackResponseFields.feedbackField', 'feedbackField')
      .addSelect(['feedbackField.name', 'feedbackField.type'])
      .addSelect('feedbackResponseFields.value')
      .orderBy('response.createdTime', 'DESC')

    return queryBuilder.offset(offset).getManyAndCount()
  }

  async deleteFeedback(feedbackId: string) {
    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await getManager().transaction(async (entityManager) => {
        await entityManager.delete(FeedbackResponse, { feedbackId })
        await entityManager.delete(FeedbackField, { feedbackId })
        await entityManager.delete(Feedback, feedbackId)
      })

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(err)
    } finally {
      await queryRunner.release()
    }
  }

  async deleteResponse(responseId: string) {
    const response = await this.feedbackResponseRepository.findOne(responseId)

    if (!response) {
      throw new NotFoundException('response not exist')
    }

    await this.feedbackResponseRepository.delete(responseId)
  }
}
