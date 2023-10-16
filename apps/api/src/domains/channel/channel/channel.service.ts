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
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { OpensearchRepository } from '@/common/repositories';
import { OS_USE } from '@/configs/opensearch.config';
import { ProjectService } from '@/domains/project/project/project.service';
import { FieldService } from '../field/field.service';
import { ChannelMySQLService } from './channel.mysql.service';
import type { FindAllChannelsByProjectIdDto, FindByChannelIdDto } from './dtos';
import {
  CreateChannelDto,
  UpdateChannelDto,
  UpdateChannelFieldsDto,
} from './dtos';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelMySQLService: ChannelMySQLService,
    private readonly osRepository: OpensearchRepository,
    private readonly projectService: ProjectService,
    private readonly fieldService: FieldService,
  ) {}

  @Transactional()
  async create(dto: CreateChannelDto) {
    await this.projectService.findById({ projectId: dto.projectId });

    const { id } = await this.channelMySQLService.create(dto);
    if (OS_USE) {
      await this.osRepository.createIndex({ index: id.toString() });
    }

    const fields = dto.fields;
    await this.fieldService.createMany({ channelId: id, fields });

    return { id };
  }

  async findAllByProjectId(dto: FindAllChannelsByProjectIdDto) {
    return this.channelMySQLService.findAllByProjectId(dto);
  }

  async findById(dto: FindByChannelIdDto) {
    return this.channelMySQLService.findById(dto);
  }

  @Transactional()
  async updateInfo(channelId: number, dto: UpdateChannelDto) {
    await this.channelMySQLService.update(channelId, dto);
  }

  @Transactional()
  async updateFields(channelId: number, dto: UpdateChannelFieldsDto) {
    await this.fieldService.replaceMany({
      channelId: channelId,
      fields: dto.fields,
    });
  }

  @Transactional()
  async deleteById(channelId: number) {
    if (OS_USE) {
      await this.osRepository.deleteIndex(channelId.toString());
    }

    await this.channelMySQLService.delete(channelId);
  }
}
