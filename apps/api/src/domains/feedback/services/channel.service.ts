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
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Like, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ChannelEntity } from '../entities/channel.entity';
import {
  ChannelAlreadyExistsException,
  ChannelInvalidNameException,
  ChannelNotFoundException,
} from '../exceptions/channels';
import { ElasticsearchRepository } from '../repositories/elasticsearch.repository';
import {
  CreateChannelDto,
  FindAllChannelsByProjectIdDto,
  FindByChannelIdDto,
  UpdateChannelDto,
} from './dtos';
import { FieldService } from './field.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly repository: Repository<ChannelEntity>,
    private readonly esRepository: ElasticsearchRepository,
    private readonly fieldService: FieldService,
  ) {}

  @Transactional()
  async create(dto: CreateChannelDto) {
    const channel = CreateChannelDto.toChannelEntity(dto);
    const fields = dto.fields;

    const duplicateChannel = await this.repository.findOneBy({
      name: channel.name,
    });

    if (duplicateChannel) throw new ChannelAlreadyExistsException();

    const savedChannel = await this.repository.save(channel);

    await this.esRepository.createIndex({ index: savedChannel.id });
    await this.fieldService.createMany({ channelId: savedChannel.id, fields });

    return savedChannel;
  }

  async findAllByProjectId(dto: FindAllChannelsByProjectIdDto) {
    const { options, projectId, keyword = '' } = dto;
    return await paginate(this.repository, options, {
      where: { project: { id: projectId }, name: Like(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
  }

  async findById({ channelId }: FindByChannelIdDto) {
    const channel = await this.repository.findOneBy({ id: channelId });
    if (!channel) throw new ChannelNotFoundException();
    return channel;
  }

  @Transactional()
  async update({ channelId, fields, name, description }: UpdateChannelDto) {
    await this.findById({ channelId });

    if (
      await this.repository.findOne({
        where: { name, id: Not(channelId) },
        select: ['id'],
      })
    ) {
      throw new ChannelInvalidNameException('Duplicated name');
    }
    await this.repository.update(channelId, { name, description });
    await this.fieldService.replaceMany({ channelId, fields });
  }
}
