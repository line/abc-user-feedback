/* */
import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common'
import { Response } from 'express'
import { ApiTags, ApiBody } from '@nestjs/swagger'

/* */
import { TenantService } from './tenant.service'
import { CreateServiceDto } from './dto/create-service.dto'

@ApiTags('Role')
@Controller('api/v1/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @ApiBody({ type: CreateServiceDto })
  @Post()
  @HttpCode(201)
  async createService(@Res() res: Response, @Body() data: CreateServiceDto) {
    const service = await this.tenantService.create(data)
    return res.send(service)
  }
}
