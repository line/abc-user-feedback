/* */
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { Logger, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

/* */
import { AdminService } from './admin.service'
import { UpdateServiceDto, UpdateServiceInvitationDto } from './dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions } from '#/core/decorators'
import { Service } from '#/core/entity'
import { Permission } from '@/types'

@ApiTags('Service')
@Controller('api/v1/admin/service')
@UseGuards(PermissionGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name)

  constructor(private readonly adminService: AdminService) {}

  @ApiOkResponse({
    type: Service
  })
  @Get()
  @Permissions(Permission.MANAGE_TENANT)
  getService(@Req() req) {
    return this.adminService.getService()
  }

  @ApiOkResponse({
    type: Service
  })
  @Put()
  @Permissions(Permission.MANAGE_TENANT)
  async updateService(@Body() data: UpdateServiceDto) {
    const service = await this.adminService.updateService(data)
    return service
  }

  @ApiOkResponse({
    type: Service
  })
  @Put('invitation')
  @Permissions(Permission.MANAGE_INVITATION)
  async updateInvitation(@Body() data: UpdateServiceInvitationDto) {
    const service = await this.adminService.updateInvitation(data)
    return service
  }
}
