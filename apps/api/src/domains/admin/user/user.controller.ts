/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PaginationRequestDto } from '@/common/dtos';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from './decorators';
import { UserDto } from './dtos';
import {
  ChangePasswordRequestDto,
  DeleteUsersRequestDto,
  GetAllUsersRequestDto,
  ResetPasswordMailingRequestDto,
  ResetPasswordRequestDto,
  UpdateUserRequestDto,
  UserInvitationRequestDto,
} from './dtos/requests';
import { GetRolesByIdResponseDto } from './dtos/responses';
import { GetAllUserResponseDto } from './dtos/responses/get-all-user-response.dto';
import { UserTypeEnum } from './entities/enums';
import { SuperUser } from './super-user.decorator';
import { UserPasswordService } from './user-password.service';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('/admin/users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  @ApiOkResponse({ type: GetAllUserResponseDto })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Query() query: PaginationRequestDto) {
    const { limit, page } = query;
    const users = await this.userService.findAll({
      options: { limit, page },
    });
    return GetAllUserResponseDto.transform(users);
  }

  @ApiOkResponse({ type: GetAllUserResponseDto })
  @Post('/search')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Body() body: GetAllUsersRequestDto) {
    const { limit, page, queries, order, operator } = body;
    const users = await this.userService.findAll({
      options: { limit, page },
      queries,
      order,
      operator,
    });
    return GetAllUserResponseDto.transform(users);
  }

  @Delete()
  @SuperUser()
  async deleteUsers(@Body() body: DeleteUsersRequestDto) {
    await this.userService.deleteUsers(body.ids);
  }

  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ) {
    if (id !== user.id) throw new UnauthorizedException('');
    return UserDto.transform(await this.userService.findById(id));
  }

  @ApiOkResponse({ type: GetRolesByIdResponseDto })
  @Get(':userId/roles')
  @UseGuards(JwtAuthGuard)
  async getRoles(@Param('userId', ParseIntPipe) userId: number) {
    const roles = await this.userService.findRolesById(userId);
    return { roles };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ) {
    if (user.id !== id) throw new UnauthorizedException();
    await this.userService.deleteById(id);
  }

  @Put('/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRequestDto,
    @CurrentUser() user: UserDto,
  ) {
    if (user.type === UserTypeEnum.GENERAL) {
      if (dto.type)
        throw new UnauthorizedException('GENERAL user cannot modify user type');
      if (user.id !== userId)
        throw new UnauthorizedException(
          'GENERAL user cannot modify other user',
        );
    }
    await this.userService.updateUser({ userId, ...dto });
  }

  @Post('invite')
  @SuperUser()
  async inviteUser(
    @Body() body: UserInvitationRequestDto,
    @CurrentUser() user: UserDto,
  ) {
    if (body.userType === UserTypeEnum.SUPER && body.roleId) {
      throw new BadRequestException('SUPER user must not have role');
    }
    await this.userService.sendInvitationCode({ ...body, invitedBy: user });
  }

  @ApiBody({ type: ResetPasswordMailingRequestDto })
  @Post('password/reset/code')
  async requestResetPassword(@Body('email') email: string) {
    await this.userPasswordService.sendResetPasswordMail(email);
  }

  @Post('password/reset')
  async resetPassword(@Body() body: ResetPasswordRequestDto) {
    await this.userPasswordService.resetPassword(body);
  }

  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() { newPassword, password }: ChangePasswordRequestDto,
  ) {
    await this.userPasswordService.changePassword({
      newPassword,
      password,
      userId: user.id,
    });
  }
}
