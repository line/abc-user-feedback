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
import { DateTime } from 'luxon'
import { Response } from 'express'
import * as XLSX from 'xlsx'

/* */
import { FeedbackService } from './feedback.service'
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto'
import { PaginationParams } from '#/core/params'
import { Roles } from '#/core/decorators'
import { RoleGuard } from '#/core/guard'
import { UserRole } from '@/types'

@Controller('api/v1')
@UseGuards(RoleGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Roles(UserRole.Admin)
  @Post('admin/feedback')
  async createFeedback(@Req() req: any, @Body() data: CreateFeedbackDto) {
    const userId = req.user.id
    const feedback = await this.feedbackService.createFeedback(data, userId)

    return feedback
  }

  @Roles(UserRole.Admin)
  @Delete('admin/feedback/:idOrCode')
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

  @Roles(UserRole.Admin)
  @Get('admin/feedback')
  async getAll(@Query() pagination: PaginationParams) {
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

  @Roles(UserRole.Admin)
  @Get('admin/feedback/:idOrCode')
  async findById(@Param('idOrCode') idOrCode = ''): Promise<any> {
    const feedback = await this.feedbackService.findFeedback(idOrCode)

    if (!feedback) {
      throw new NotFoundException()
    }

    return feedback
  }

  @Roles(UserRole.Admin)
  @Patch('admin/feedback/:idOrCode')
  async updateFeedback(
    @Param('idOrCode') idOrCode,
    @Body() data: UpdateFeedbackDto
  ): Promise<any> {
    const feedback = await this.feedbackService.updateFeedback(idOrCode, data)
    return feedback
  }

  @Roles(UserRole.Admin)
  @Get('admin/feedback/:idOrCode/response')
  async getAllResponse(
    @Param('idOrCode') idOrCode = '',
    @Query() pagination: PaginationParams,
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

  @Roles(UserRole.Admin)
  @Delete('admin/response/:responseId')
  async deleteReponse(
    @Res() res: Response,
    @Param('responseId') responseId = ''
  ) {
    await this.feedbackService.deleteResponse(responseId)
    res.status(204).end()
  }

  @Roles(UserRole.Owner)
  @Get('admin/feedback/:idOrCode/response/export')
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
        time: DateTime.fromJSDate(response.createdTime).toFormat(
          'yyyy-MM-dd, HH:mm'
        )
      }

      const { feedbackResponseFields } = response

      feedbackResponseFields.map((field) => {
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
