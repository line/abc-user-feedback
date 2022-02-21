/* */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

/* */
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions } from '#/core/decorators'
import { Permission } from '@/types'
import { AuthService } from '#/auth/auth.service'

@ApiTags('User')
@Controller('api/v1')
@UseGuards(PermissionGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @ApiBearerAuth('access-token')
  @Get('user/current')
  async getCurrentUser(@Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException()
    }

    return this.userService.getUserById(req.user.Id)
  }

  @ApiBody({ type: UpdateUserDto })
  @Put('user/setting')
  updateUserProfile(@Req() req: any, @Body() data: UpdateUserDto) {
    if (!req.user) {
      throw new UnauthorizedException()
    }

    return this.userService.updateUserProfile(req.user.id, data)
  }

  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ description: 'Delete User' })
  @Delete('user')
  @HttpCode(204)
  async deleteSelfUser(@Req() req: any, @Res() res: Response) {
    if (!this.configService.get<boolean>('app.useDeleteAccount')) {
      throw new MethodNotAllowedException()
    }

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
  @Permissions(Permission.READ_USERS)
  async getUsers() {
    return this.userService.getUsers()
  }

  @Delete('admin/user/:userId')
  @Permissions(Permission.DELETE_USER)
  async deleteUser(@Req() req: any, @Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId)

    if (!user) {
      throw new NotFoundException()
    }

    await this.userService.deleteUser(userId)
  }
}
