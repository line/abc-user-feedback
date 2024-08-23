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
import type { Server } from 'net';
import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Client } from '@opensearch-project/opensearch';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { FieldFormatEnum } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { createFieldDto, getRandomValue } from '@/test-utils/fixtures';
import { clearEntities } from '@/test-utils/util-functions';

interface OpenSearchResponse {
  _source: Record<string, any>;
  total: { value: number };
}

describe('FeedbackController (integration)', () => {
  let app: INestApplication;

  let tenantService: TenantService;
  let projectService: ProjectService;
  let channelService: ChannelService;
  let feedbackService: FeedbackService;

  let tenantRepo: Repository<TenantEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let osService: Client;
  let opensearchRepository: OpensearchRepository;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    tenantService = module.get(TenantService);
    projectService = module.get(ProjectService);
    channelService = module.get(ChannelService);
    feedbackService = module.get(FeedbackService);

    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    osService = module.get<Client>('OPENSEARCH_CLIENT');
    opensearchRepository = module.get(OpensearchRepository);
  });

  let channel: ChannelEntity;
  let fields: FieldEntity[];

  beforeEach(async () => {
    // console.log(opensearchRepository);
    await opensearchRepository.deleteIndex('1');
    // await osService.delete({ index: '*' });
    await clearEntities([tenantRepo, projectRepo, channelRepo, fieldRepo]);
    const dto = new SetupTenantRequestDto();
    dto.siteName = faker.string.sample();
    await tenantService.create(dto);
    const { id: projectId } = await projectService.create({
      name: faker.lorem.words(),
      description: faker.lorem.lines(1),
      timezone: {
        countryCode: 'KR',
        name: 'Asia/Seoul',
        offset: '+09:00',
      },
    });

    const { id: channelId } = await channelService.create({
      projectId,
      name: faker.string.alphanumeric(20),
      description: faker.lorem.lines(1),
      fields: Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto),
      imageConfig: null,
    });

    console.log(channelId);
    channel = await channelService.findById({ channelId });

    fields = await fieldRepo.find({
      where: { channel: { id: channel.id } },
      relations: { options: true },
    });
    console.log(channel);
  });

  it('/admin/channels/:channelId/feedbacks (POST)', () => {
    console.log(channel);
    const dto: Record<string, string | number | string[] | number[]> = {};
    fields
      .filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
      .forEach(({ name, format, options }) => {
        dto[name] = getRandomValue(format, options);
      });

    return request(app.getHttpServer() as Server)
      .post(`/admin/channels/${channel.id}/feedbacks`)
      .send(dto)
      .expect(201)
      .then(
        async ({
          body,
        }: {
          body: Record<string, any> & { issueNames?: string[] };
        }) => {
          expect(body.id).toBeDefined();
          const esResult = await osService.get<OpenSearchResponse>({
            id: body.id as string,
            index: channel.id.toString(),
          });

          delete esResult.body._source[
            (fields.find((v) => v.name === 'createdAt') ?? { id: 0 }).id
          ];
          expect(toApi(dto, fields)).toMatchObject(esResult.body._source);
        },
      );
  });

  afterAll(async () => {
    await app.close();
  });
});

const toApi = (
  data: Record<string, string | number | string[] | number[]>,
  fields: FieldEntity[],
) => {
  return Object.entries(data).reduce((prev, [key, value]) => {
    const field: FieldEntity =
      fields.find((v) => v.name === key) ?? new FieldEntity();
    return Object.assign(prev, {
      [field.id]:
        field.format === FieldFormatEnum.select ?
          (
            (field.options ?? []).find((v) => v.name === value) ??
            new FieldEntity()
          ).id
        : value,
    });
  }, {});
};
