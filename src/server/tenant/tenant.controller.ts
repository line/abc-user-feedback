/* */
import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'

/* */
import { TenantService } from './tenant.service'
import { CreateServiceDto } from './dto/create-service.dto'

@Controller('api/v1/tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createService(@Res() res: Response, @Body() data: CreateServiceDto) {
    try {
      const service = await this.tenantService.create(data)
      return res.send(service)
    } catch (err) {
      throw err
    }
  }
}
