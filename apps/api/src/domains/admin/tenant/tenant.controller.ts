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
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SetupTenantRequestDto, UpdateTenantRequestDto } from './dtos/requests';
import {
  CountFeedbacksByTenantIdResponseDto,
  GetTenantResponseDto,
} from './dtos/responses';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('/admin/tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async setup(@Body() body: SetupTenantRequestDto) {
    await this.tenantService.create(body);
  }

  @Put()
  @HttpCode(204)
  async update(@Body() body: UpdateTenantRequestDto) {
    await this.tenantService.update(body);
  }

  @ApiOkResponse({ type: GetTenantResponseDto })
  @Get()
  async get() {
    const tenant = await this.tenantService.findOne();
    return GetTenantResponseDto.transform(tenant);
  }

  @ApiOkResponse({ type: CountFeedbacksByTenantIdResponseDto })
  @Get('/:tenantId/feedback-count')
  async countFeedbacks(@Param('tenantId', ParseIntPipe) tenantId: number) {
    return CountFeedbacksByTenantIdResponseDto.transform(
      await this.tenantService.countByTenantId({ tenantId }),
    );
  }
}
