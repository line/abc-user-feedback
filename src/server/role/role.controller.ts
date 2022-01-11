/* */
import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  HttpCode
} from '@nestjs/common'

/* */
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { RoleUserDto } from './dto/role-user-binding.dto'
import { RolePermissionDto } from './dto/role-permission-binding.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Controller('api/v1/admin/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto)
  }

  @Get()
  findAll() {
    return this.roleService.findAllRole()
  }

  @Get(':roleName')
  findRoleByName(@Param('roleName') roleName: string) {
    return this.roleService.findRoleByName(roleName)
  }

  @Put(':roleName')
  updateRole(
    @Param('roleName') roleName: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.roleService.updateRole(roleName, updateRoleDto)
  }

  @Delete(':roleName')
  @HttpCode(204)
  remove(@Param('roleName') roleName: string) {
    return this.roleService.removeRole(roleName)
  }

  @Post('binding/user')
  roleUserBinding(@Body() roleUserDto: RoleUserDto) {
    return this.roleService.roleUserBinding(roleUserDto)
  }

  @Delete('binding/user')
  roleUserUnbinding(@Body() roleUserDto: RoleUserDto) {
    return this.roleService.roleUserUnbinding(roleUserDto)
  }

  @Post('binding/permission')
  rolePermissionBinding(@Body() rolePermissionDto: RolePermissionDto) {
    return this.roleService.rolePermissionBinding(rolePermissionDto)
  }

  @Delete('binding/permission')
  rolePermissionUnbinding(@Body() rolePermissionDto: RolePermissionDto) {
    return this.roleService.rolePermissionUnbinding(rolePermissionDto)
  }

  @Get('binding/permission')
  getRolePermissions(@Query('roleName') roleName: string) {
    return this.roleService.getRolePermissions(roleName)
  }
}
