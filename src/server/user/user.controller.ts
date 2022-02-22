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
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

/* */
import { UserService } from './user.service'
import { UserDto, UpdateUserDto } from './dto'
import { PermissionGuard } from '#/core/guard'
import { Permissions, ApiPaginatedResponse } from '#/core/decorators'
import { Permission } from '@/types'
import { AuthService } from '#/auth/auth.service'
import { PaginatedResultDto, PagingQuery } from '#/core/dto'
import { User } from '#/core/entity'

@ApiBearerAuth('access-token')
@ApiTags('User')
@Controller('api/v1')
@UseGuards(PermissionGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

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
  @ApiPaginatedResponse(UserDto)
  @Get('admin/user')
  @Permissions(Permission.READ_USERS)
  async getUsers(
    @Query() pagination: PagingQuery
  ): Promise<PaginatedResultDto<UserDto>> {
    const { offset, limit } = pagination

    const [users, total] = await this.userService.getUsers(offset, limit)

    return {
      total,
      results: users.map((user) => new UserDto(user))
    }
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
