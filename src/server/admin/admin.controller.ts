/* */
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'

/* */
import { AdminService } from './admin.service'
import { UpdateServiceDto, UpdateServiceInvitationDto } from './dto'
import { RoleGuard } from '#/core/guard'
import { Roles } from '#/core/decorators'
import { UserRole } from '@/types'

@Controller('api/v1/admin/service')
@UseGuards(RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(UserRole.Admin)
  getService() {
    return this.adminService.getService()
  }

  @Put()
  @Roles(UserRole.Owner)
  async updateService(@Body() data: UpdateServiceDto) {
    const service = await this.adminService.updateService(data)
    return service
  }

  @Put('invitation')
  @Roles(UserRole.Owner)
  async updateInvitation(@Body() data: UpdateServiceInvitationDto) {
    const service = await this.adminService.updateInvitation(data)
    return service
  }
}
