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
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';

import { OpensearchRepository } from '@/common/repositories';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import type {
  CreateImageDownloadUrlDto,
  CreateImageUploadUrlDto,
  ImageUploadUrlTestDto,
} from '../../feedback/dtos';
import { FieldService } from '../field/field.service';
import { ChannelMySQLService } from './channel.mysql.service';
import type {
  FindAllChannelsByProjectIdDto,
  FindByChannelIdDto,
  FindOneByNameAndProjectIdDto,
} from './dtos';
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
    private readonly configService: ConfigService,
  ) {}

  async checkName(dto: FindOneByNameAndProjectIdDto) {
    const res = await this.channelMySQLService.findOneBy(dto);
    return !!res;
  }

  @Transactional()
  async create(dto: CreateChannelDto) {
    await this.projectService.findById({ projectId: dto.projectId });

    const { id } = await this.channelMySQLService.create(dto);
    if (this.configService.get('opensearch.use')) {
      await this.osRepository.createIndex({ index: id.toString() });
    }

    const fields = dto.fields;
    await this.fieldService.createMany({ channelId: id, fields });

    return { id };
  }

  async findAllByProjectId(dto: FindAllChannelsByProjectIdDto) {
    return await this.channelMySQLService.findAllByProjectId(dto);
  }

  async findById(dto: FindByChannelIdDto) {
    return await this.channelMySQLService.findById(dto);
  }

  @Transactional()
  async updateInfo(channelId: number, dto: UpdateChannelDto) {
    return await this.channelMySQLService.update(channelId, dto);
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
    if (this.configService.get('opensearch.use')) {
      await this.osRepository.deleteIndex(channelId.toString());
    }

    return await this.channelMySQLService.delete(channelId);
  }

  async createImageUploadUrl(dto: CreateImageUploadUrlDto) {
    const {
      projectId,
      channelId,
      accessKeyId,
      secretAccessKey,
      endpoint,
      region,
      bucket,
      extension,
    } = dto;

    const s3 = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint,
      region,
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `${projectId}_${channelId}_${Date.now()}.${extension}`,
      ContentType: 'image/*',
      ACL: 'public-read',
    });

    return await getSignedUrl(s3, command, { expiresIn: 60 * 60 });
  }

  async createImageDownloadUrl(dto: CreateImageDownloadUrlDto) {
    const { accessKeyId, secretAccessKey, endpoint, region, bucket, imageKey } =
      dto;

    const s3 = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint,
      region,
    });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: imageKey,
    });

    return await getSignedUrl(s3, command, { expiresIn: 60 });
  }

  async isValidImageConfig(dto: ImageUploadUrlTestDto) {
    const { accessKeyId, secretAccessKey, endpoint, region, bucket } = dto;

    const s3 = new S3Client({
      credentials: { accessKeyId, secretAccessKey },
      endpoint,
      region,
    });

    const command = new ListObjectsCommand({ Bucket: bucket });

    try {
      await s3.send(command);
      return true;
    } catch {
      return false;
    }
  }
}
