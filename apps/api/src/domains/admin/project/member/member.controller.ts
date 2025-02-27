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
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionEnum } from '../role/permission.enum';
import { RequirePermission } from '../role/require-permission.decorator';
import {
  CreateMemberRequestDto,
  GetAllMemberRequestDto,
  UpdateMemberRequestDto,
} from './dtos/requests';
import { DeleteManyMemberRequestDto } from './dtos/requests/delete-many-member-request.dto';
import { GetAllMemberResponseDto } from './dtos/responses';
import { MemberService } from './member.service';

@ApiTags('members')
@Controller('/admin/projects/:projectId/members')
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @RequirePermission(PermissionEnum.project_member_read)
  @ApiOkResponse({ type: GetAllMemberResponseDto })
  @Post('/search')
  async searchMembers(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: GetAllMemberRequestDto,
  ) {
    const { limit, page, queries, operator } = body;
    return GetAllMemberResponseDto.transform(
      await this.memberService.findAll({
        options: { limit, page },
        queries,
        operator,
        projectId,
      }),
    );
  }

  @RequirePermission(PermissionEnum.project_member_create)
  @ApiParam({ name: 'projectId', type: Number })
  @Post()
  async create(@Body() body: CreateMemberRequestDto) {
    await this.memberService.create(body);
  }

  @RequirePermission(PermissionEnum.project_member_update)
  @ApiParam({ name: 'projectId', type: Number })
  @Put('/:memberId')
  async update(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() body: UpdateMemberRequestDto,
  ) {
    await this.memberService.update({ ...body, memberId });
  }

  @RequirePermission(PermissionEnum.project_member_delete)
  @ApiParam({ name: 'projectId', type: Number })
  @Delete('/:memberId')
  async delete(@Param('memberId', ParseIntPipe) memberId: number) {
    await this.memberService.delete(memberId);
  }

  @RequirePermission(PermissionEnum.project_member_delete)
  @ApiParam({ name: 'projectId', type: Number })
  @Delete()
  async deleteMany(@Body() body: DeleteManyMemberRequestDto) {
    await this.memberService.deleteMany(body);
  }
}
