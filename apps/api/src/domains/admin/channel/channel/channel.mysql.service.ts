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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { isSelectFieldFormat } from '@/common/enums';
import { paginateHelper } from '@/common/helper/paginate.helper';
import { ChannelEntity } from './channel.entity';
import type {
  FindAllChannelsByProjectIdDto,
  FindByChannelIdDto,
  FindOneByNameAndProjectIdDto,
} from './dtos';
import { CreateChannelDto, UpdateChannelDto } from './dtos';
import {
  ChannelAlreadyExistsException,
  ChannelInvalidNameException,
  ChannelNotFoundException,
} from './exceptions';

@Injectable()
export class ChannelMySQLService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly repository: Repository<ChannelEntity>,
  ) {}
  async findOneBy({ name, projectId }: FindOneByNameAndProjectIdDto) {
    return await this.repository.findOne({
      where: { name, project: { id: projectId } },
    });
  }

  @Transactional()
  async create(dto: CreateChannelDto) {
    const channel = CreateChannelDto.toChannelEntity(dto);

    const duplicateChannel = await this.repository.findOneBy({
      name: channel.name,
      project: {
        id: dto.projectId,
      },
    });

    if (duplicateChannel) throw new ChannelAlreadyExistsException();

    const savedChannel = await this.repository.save(channel);

    return savedChannel;
  }

  async findAllByProjectId(dto: FindAllChannelsByProjectIdDto) {
    const { options, projectId, searchText = '' } = dto;

    return await paginateHelper(
      this.repository.createQueryBuilder(),
      {
        where: { project: { id: projectId }, name: Like(`%${searchText}%`) },
        order: { createdAt: 'ASC' },
      },
      options,
    );
  }

  async findById({ channelId }: FindByChannelIdDto) {
    const channel = await this.repository.findOne({
      where: { id: channelId },
      relations: {
        fields: { options: true, aiFieldTemplate: true },
        project: true,
      },
    });
    if (!channel) throw new ChannelNotFoundException();

    channel.fields = channel.fields.map((field) => {
      if (!isSelectFieldFormat(field.format)) {
        delete field.options;
      }

      return field;
    });

    return channel;
  }

  @Transactional()
  async update(channelId: number, dto: UpdateChannelDto) {
    const { name, description, imageConfig, feedbackSearchMaxDays } = dto;
    const channel = await this.findById({ channelId });

    if (
      await this.repository.findOne({
        where: {
          name,
          id: Not(channelId),
          project: { id: channel.project.id },
        },
        select: ['id'],
      })
    ) {
      throw new ChannelInvalidNameException('Duplicate name');
    }

    channel.name = name;
    channel.description = description;
    channel.imageConfig = imageConfig;
    channel.feedbackSearchMaxDays = feedbackSearchMaxDays;
    return await this.repository.save(channel);
  }

  @Transactional()
  async delete(channelId: number) {
    const channel = new ChannelEntity();
    channel.id = channelId;
    return await this.repository.remove(channel);
  }
}
