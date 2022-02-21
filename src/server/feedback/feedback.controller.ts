/* */
import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  Delete,
  Patch,
  Req,
  Param,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Res,
  HttpCode
} from '@nestjs/common'
import {
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiPropertyOptional
} from '@nestjs/swagger'
import { DateTime } from 'luxon'
import { Response } from 'express'
import { sortBy } from 'lodash'
import * as XLSX from 'xlsx'

/* */
import { FeedbackService } from './feedback.service'
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto'
import { PagingQuery } from '#/core/dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions } from '#/core/decorators'
import { Permission } from '@/types'

@Controller('api/v1')
@UseGuards(PermissionGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOperation({ summary: 'Create user feedback' })
  @ApiBody({ type: CreateFeedbackDto })
  @Post('admin/feedback')
  @Permissions(Permission.CREATE_FEEDBACK)
  async createFeedback(@Req() req: any, @Body() data: CreateFeedbackDto) {
    const userId = req.user.id
    const feedback = await this.feedbackService.createFeedback(data, userId)

    return feedback
  }

  @Get('admin/feedback')
  @Permissions(Permission.READ_FEEDBACKS)
  async getAll(@Query() pagination: PagingQuery) {
    const { offset, limit } = pagination
    const [items, totalCount] = await this.feedbackService.findAllFeedback(
      offset,
      limit
    )

    return {
      items,
      totalCount
    }
  }

  @ApiOperation({ summary: 'Get user feedback' })
  @ApiParam({
    name: 'idOrCode',
    required: true,
    description: 'feedback code or uuid',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] }
  })
  @Get('admin/feedback/:idOrCode')
  @Permissions(Permission.READ_FEEDBACK)
  async findByIdOrCode(@Param('idOrCode') idOrCode = ''): Promise<any> {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new NotFoundException()
    }

    return feedback
  }

  @Patch('admin/feedback/:idOrCode')
  @Permissions(Permission.UPDATE_FEEDBACK)
  async updateFeedback(
    @Param('idOrCode') idOrCode,
    @Body() data: UpdateFeedbackDto
  ): Promise<any> {
    const feedback = await this.feedbackService.updateFeedback(idOrCode, data)
    return feedback
  }

  @ApiOperation({ summary: 'Delete user feedback' })
  @ApiParam({
    name: 'idOrCode',
    required: true,
    description: 'feedback code or uuid',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] }
  })
  @Delete('admin/feedback/:idOrCode')
  @Permissions(Permission.DELETE_FEEDBACK)
  @HttpCode(204)
  async deleteFeedback(
    @Req() req: any,
    @Res() res: Response,
    @Param('idOrCode') idOrCode = ''
  ) {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new NotFoundException()
    }

    await this.feedbackService.deleteFeedback(feedback.id)

    res.end()
  }

  @Get('admin/feedback/:idOrCode/response')
  @Permissions(Permission.READ_FEEDBACK)
  async getAllResponse(
    @Param('idOrCode') idOrCode = '',
    @Query() pagination: PagingQuery,
    @Query() restQuery
  ): Promise<any> {
    const { offset, limit } = pagination

    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new BadRequestException(`feedback from ${idOrCode} not exist`)
    }

    const [items, totalCount] = await this.feedbackService.getResponses(
      feedback.id,
      offset,
      limit,
      restQuery
    )

    return {
      items,
      totalCount
    }
  }

  @Get('admin/feedback/:idOrCode/response/:id')
  @Permissions(Permission.READ_FEEDBACK)
  async getResponseById(
    @Res() res: Response,
    @Param('idOrCode') idOrCode = '',
    @Param('id') id
  ) {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new BadRequestException(`feedback from ${idOrCode} not exist`)
    }

    const response = await this.feedbackService.getReponseById(feedback.id, id)

    return res.send(response)
  }

  @Delete('admin/feedback/:idOrCode/response/:id')
  @Permissions(Permission.DELETE_RESPONSE)
  async deleteReponse(
    @Res() res: Response,
    @Param('idOrCode') idOrCode = '',
    @Param('id') id
  ) {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new BadRequestException(`feedback from ${idOrCode} not exist`)
    }

    await this.feedbackService.deleteResponse(feedback.id, id)
    res.status(204).end()
  }

  @Get('admin/feedback/:idOrCode/response/export')
  @Permissions(Permission.EXPORT_RESPONSE)
  async exportResponse(
    @Res() res: Response,
    @Param('idOrCode') idOrCode = '',
    @Query('type') type
  ) {
    if (!type) {
      throw new BadRequestException(`missing parameter type`)
    } else if (type !== 'xlsx' && type !== 'csv') {
      throw new BadRequestException(`not support type: ${type}`)
    }

    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new BadRequestException(`feedback from ${idOrCode} not exist`)
    }

    const [responses] = await this.feedbackService.getResponses(feedback.id, 0)
    const mappaed = responses.map((response) => {
      const data = {
        no: response.id,
        time: DateTime.fromJSDate(response.createdTime).toFormat(
          'yyyy-MM-dd HH:mm'
        )
      }

      const { feedbackResponseFields } = response

      const sorted = sortBy(feedbackResponseFields, (response) => {
        return feedback?.fields.find(
          (f) => f.name === response.feedbackField.name
        )?.order
      })

      sorted.map((field) => {
        data[field.feedbackField.name] = field.value
      })
      return data
    })

    const filename = `${feedback.title}-${DateTime.now().toFormat(
      'yyyy_MM_dd_HH_mm'
    )}.${type}`

    const workbook = XLSX.utils.book_new()
    const newWorksheet = XLSX.utils.json_to_sheet(mappaed)

    XLSX.utils.book_append_sheet(workbook, newWorksheet, 'feedback')
    const buffer = XLSX.write(workbook, {
      bookType: type,
      type: 'buffer'
    })

    if (type === 'xlsx') {
      res.type(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    } else if (type === 'csv') {
      res.type('text/csv')
    }

    res.header('Content-Disposition', `attachment; filename=${filename}`)

    return res.send(buffer)
  }

  @Post('feedback/:idOrCode/response')
  async createResponse(
    @Req() req: any,
    @Body() data: Record<string, any>,
    @Param('idOrCode') idOrCode = ''
  ): Promise<any> {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new BadRequestException(`feedback from ${idOrCode} not exist`)
    }

    if (!feedback.allowAnonymous && !req.user) {
      throw new UnauthorizedException()
    }
    return this.feedbackService.createResponse(data, feedback, req.user?.id)
  }
}
