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
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import type { Client } from '@opensearch-project/opensearch';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { FieldFormatEnum } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import type { CreateFeedbackDto } from '@/domains/admin/feedback/dtos';
import type { FindFeedbacksByChannelIdRequestDto } from '@/domains/admin/feedback/dtos/requests';
import type { FindFeedbacksByChannelIdResponseDto } from '@/domains/admin/feedback/dtos/responses';
import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { getRandomValue } from '@/test-utils/fixtures';
import {
  clearAllEntities,
  clearEntities,
  createChannel,
  createProject,
  createTenant,
  signInTestUser,
} from '@/test-utils/util-functions';

interface OpenSearchResponse {
  _source: Record<string, any>;
  total: { value: number };
}

describe('FeedbackController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;

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

  let project: ProjectEntity;
  let channel: ChannelEntity;
  let fields: FieldEntity[];

  let accessToken: string;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get(getDataSourceToken());

    authService = module.get(AuthService);

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

    await opensearchRepository.deleteIndexAll();
    await clearAllEntities(module);

    await createTenant(tenantService);
    project = await createProject(projectService);
    const { id: channelId } = await createChannel(channelService, project);

    channel = await channelService.findById({ channelId });

    fields = await fieldRepo.find({
      where: { channel: { id: channel.id } },
      relations: { options: true },
    });

    const { jwt } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;
  });

  it('/admin/projects/:projectId/channels/:channelId/feedbacks (POST)', () => {
    const dto: Record<string, string | number | string[] | number[]> = {};
    fields
      .filter(
        ({ key }) =>
          key !== 'id' &&
          key !== 'issues' &&
          key !== 'createdAt' &&
          key !== 'updatedAt',
      )
      .forEach(({ key, format, options }) => {
        dto[key] = getRandomValue(format, options);
      });

    return request(app.getHttpServer() as Server)
      .post(`/admin/projects/${project.id}/channels/${channel.id}/feedbacks`)
      .set('x-api-key', `${process.env.MASTER_API_KEY}`)
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

          ['id', 'createdAt', 'updatedAt'].forEach(
            (field) => delete esResult.body._source[field],
          );
          expect(dto).toMatchObject(esResult.body._source);
        },
      );
  });

  it('/admin/projects/:projectId/channels/:channelId/feedbacks/search (POST)', async () => {
    const dto: CreateFeedbackDto = {
      channelId: channel.id,
      data: {},
    };
    fields
      .filter(
        ({ key }) =>
          key !== 'id' &&
          key !== 'issues' &&
          key !== 'createdAt' &&
          key !== 'updatedAt',
      )
      .forEach(({ key, format, options }) => {
        dto.data[key] = getRandomValue(format, options);
      });

    await feedbackService.create(dto);

    const keywordField = fields.find(
      ({ format }) => format === FieldFormatEnum.keyword,
    );
    if (!keywordField) return;

    const findFeedbackDto: FindFeedbacksByChannelIdRequestDto = {
      query: {
        searchText: dto.data[keywordField.key] as string,
      },
      limit: 10,
      page: 1,
    };

    return request(app.getHttpServer() as Server)
      .post(
        `/admin/projects/${project.id}/channels/${channel.id}/feedbacks/search`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send(findFeedbackDto)
      .expect(201)
      .then(({ body }: { body: FindFeedbacksByChannelIdResponseDto }) => {
        expect(body.meta.itemCount).toBeGreaterThan(0);
      });
  });

  it('/admin/projects/:projectId/channels/:channelId/feedbacks/:feedbackId (PUT)', async () => {
    const dto: CreateFeedbackDto = {
      channelId: channel.id,
      data: {},
    };
    let availableFieldKey = '';
    fields
      .filter(
        ({ key }) =>
          key !== 'id' &&
          key !== 'issues' &&
          key !== 'createdAt' &&
          key !== 'updatedAt',
      )
      .forEach(({ key, format, options }) => {
        dto.data[key] = getRandomValue(format, options);
        availableFieldKey = key;
      });

    const feedback = await feedbackService.create(dto);

    return request(app.getHttpServer() as Server)
      .put(
        `/admin/projects/${project.id}/channels/${channel.id}/feedbacks/${feedback.id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        [availableFieldKey]: 'test',
      })
      .expect(200)
      .then(async () => {
        const esResult = await osService.get<OpenSearchResponse>({
          id: feedback.id.toString(),
          index: channel.id.toString(),
        });

        ['id', 'createdAt', 'updatedAt'].forEach(
          (field) => delete esResult.body._source[field],
        );

        dto.data[availableFieldKey] = 'test';
        expect(dto.data).toMatchObject(esResult.body._source);
      });
  });

  afterAll(async () => {
    await clearEntities([tenantRepo, projectRepo, channelRepo, fieldRepo]);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(500);
    await app.close();
  });
});
