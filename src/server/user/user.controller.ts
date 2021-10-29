/* */
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  HttpCode,
  UnauthorizedException,
  UseGuards,
  Res
} from '@nestjs/common'
import { Response } from 'express'

/* */
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { BindingUserRoleDto } from './dto/binding-user-role-dto'
import { RoleGuard } from '#/core/guard'
import { Roles } from '#/core/decorators'
import { UserRole } from '@/types'
import { AuthService } from '#/auth/auth.service'

@Controller('api/v1')
@UseGuards(RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get('user/current')
  async getCurrentUser(@Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException()
    }

    return this.userService.getUserById(req.user.Id)
  }

  @Put('user/setting')
  updateUserProfile(@Req() req: any, @Body() data: UpdateUserDto) {
    if (!req.user) {
      throw new UnauthorizedException()
    }

    return this.userService.updateUserProfile(req.user.id, data)
  }

  @Delete('user')
  @HttpCode(204)
  async deleteSelfUser(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException()
    }

    this.authService.clearCookie(res)
    await this.userService.deleteUser(req.user.id)
    return res.end()
  }

  /**
   * Admin
   */
  @Get('admin/user')
  @Roles(UserRole.Manager)
  async getUsers() {
    return this.userService.getUsers()
  }

  @Delete('admin/user/:userId')
  @Roles(UserRole.Manager)
  async deleteUser(@Req() req: any, @Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId)

    if (user.role > req.user.role) {
      throw new ForbiddenException()
    }

    await this.userService.deleteUser(userId)
  }

  @Post('admin/user/role/:userRole')
  @Roles(UserRole.Manager)
  @HttpCode(204)
  async userRoleBindingToAdmin(
    @Req() req: any,
    @Body() data: BindingUserRoleDto,
    @Param('userRole') userRole: UserRole
  ) {
    const { userId } = data

    if (req.user.role < userRole) {
      throw new ForbiddenException()
    }

    await this.userService.roleBinding(userId, userRole)
  }
}
