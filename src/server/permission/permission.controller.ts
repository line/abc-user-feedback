/* */
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

/* */
import { PermissionService } from './permission.service'

@ApiTags('Permission')
@Controller('api/v1/admin/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll() {
    return this.permissionService.getAllPermissions()
  }
}
