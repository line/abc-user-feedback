/* */
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { Logger, Req } from '@nestjs/common'

/* */
import { AdminService } from './admin.service'
import { UpdateServiceDto, UpdateServiceInvitationDto } from './dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions } from '#/core/decorators'
import { Permission } from '@/types'

@Controller('api/v1/admin/service')
@UseGuards(PermissionGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name)

  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Permissions(Permission.MANAGE_TENANT)
  getService(@Req() req) {
    return this.adminService.getService()
  }

  @Put()
  @Permissions(Permission.MANAGE_TENANT)
  async updateService(@Body() data: UpdateServiceDto) {
    const service = await this.adminService.updateService(data)
    return service
  }

  @Put('invitation')
  @Permissions(Permission.MANAGE_INVITATION)
  async updateInvitation(@Body() data: UpdateServiceInvitationDto) {
    const service = await this.adminService.updateInvitation(data)
    return service
  }
}
