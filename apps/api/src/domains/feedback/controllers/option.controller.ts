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
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { OptionService } from '../services/option.service';
import { CreateOptionRequestDto } from './dtos/requests';
import {
  CreateOptionResponseDto,
  FindOptionByFieldIdResponseDto,
} from './dtos/responses';

@Controller('/field/:fieldId/options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @ApiOkResponse({ type: [FindOptionByFieldIdResponseDto] })
  @Get()
  async getOptions(@Param('fieldId') fieldId: string) {
    return (await this.optionService.findByFieldId({ fieldId })).map((v) =>
      FindOptionByFieldIdResponseDto.transform(v),
    );
  }

  @ApiCreatedResponse({ type: CreateOptionResponseDto })
  @Post()
  async creaetOption(
    @Param('fieldId') fieldId: string,
    @Body() body: CreateOptionRequestDto,
  ) {
    return CreateOptionResponseDto.transform(
      await this.optionService.create({ fieldId, ...body }),
    );
  }
}
