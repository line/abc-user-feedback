/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';
import { RequirePermission } from '@/domains/admin/project/role/require-permission.decorator';
import { CreateOptionRequestDto } from './dtos/requests';
import {
  CreateOptionResponseDto,
  FindOptionByFieldIdResponseDto,
} from './dtos/responses';
import { OptionService } from './option.service';

@Controller('/admin/fields/:fieldId/options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @ApiOkResponse({ type: [FindOptionByFieldIdResponseDto] })
  @Get()
  async getOptions(@Param('fieldId', ParseIntPipe) fieldId: number) {
    return (await this.optionService.findByFieldId({ fieldId })).map((v) =>
      FindOptionByFieldIdResponseDto.transform(v),
    );
  }

  @ApiCreatedResponse({ type: CreateOptionResponseDto })
  @RequirePermission(PermissionEnum.feedback_update)
  @Post()
  async createOption(
    @Param('fieldId', ParseIntPipe) fieldId: number,
    @Body() body: CreateOptionRequestDto,
  ) {
    return CreateOptionResponseDto.transform(
      await this.optionService.create({ fieldId, ...body }),
    );
  }
}
