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
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';
import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import { CurrentUser } from './decorators';
import { UserDto } from './dtos';
import {
  ChangePasswordRequestDto,
  DeleteUsersRequestDto,
  GetAllUserRequestDto,
  ResetPasswordMailingRequestDto,
  ResetPasswordRequestDto,
  UpdateUserRoleRequestDto,
  UserInvitationRequestDto,
} from './dtos/requests';
import { GetAllUserResponseDto } from './dtos/responses/get-all-user-response.dto';
import { UserPasswordService } from './user-password.service';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  @ApiOkResponse({ type: GetAllUserResponseDto })
  @Get()
  @RequirePermission(PermissionEnum.UserManagement)
  async getAllUsers(@Query() query: GetAllUserRequestDto) {
    const { limit, page, keyword } = query;
    return GetAllUserResponseDto.transform(
      await this.userService.findAll({ options: { limit, page }, keyword }),
    );
  }

  @Delete()
  @RequirePermission(PermissionEnum.UserManagement)
  async deleteUsers(@Body() body: DeleteUsersRequestDto) {
    await this.userService.deleteUsers(body.ids);
  }

  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string, @CurrentUser() user: UserDto) {
    if (id !== user?.id) throw new UnauthorizedException('');
    return UserDto.transform(await this.userService.findById(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: UserDto, @Param('id') id: string) {
    if (user.id !== id) throw new UnauthorizedException();
    await this.userService.deleteById(id);
  }

  @Put(':id/role')
  @HttpCode(204)
  @RequirePermission(PermissionEnum.UserManagement)
  async updateRole(
    @Param('id') id: string,
    @Body() { roleId }: UpdateUserRoleRequestDto,
  ) {
    await this.userService.updateUserRole({ roleId, userId: id });
  }

  @Post('invite')
  @RequirePermission(PermissionEnum.UserManagement)
  async inviteUser(@Body() body: UserInvitationRequestDto) {
    await this.userService.sendInvitationCode(body);
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

  @UseGuards(JwtAuthGuard)
  @Post('password/change')
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
