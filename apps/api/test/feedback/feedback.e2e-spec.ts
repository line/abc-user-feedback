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
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '@opensearch-project/opensearch';
import request from 'supertest';
import type { Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { FieldFormatEnum } from '@/common/enums';
import { HttpExceptionFilter } from '@/common/filters';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { createFieldDto, getRandomValue } from '@/test-utils/fixtures';
import { clearEntities } from '@/test-utils/util-functions';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let projectService: ProjectService;
  let channelService: ChannelService;
  let feedbackService: FeedbackService;

  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let osService: Client;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    projectService = module.get(ProjectService);
    channelService = module.get(ChannelService);
    feedbackService = module.get(FeedbackService);

    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    osService = module.get(Client);
  });

  afterAll(async () => {
    await app.close();
  });

  let channel: ChannelEntity = new ChannelEntity();
  let fields: FieldEntity[];
  beforeEach(async () => {
    await clearEntities([projectRepo, channelRepo, fieldRepo]);
    const { id: projectId } = await projectService.create({
      name: faker.word.noun(),
      description: faker.lorem.lines(1),
      timezone: {
        countryCode: 'KR',
        name: 'Asia/Seoul',
        offset: '+09:00',
      },
    });

    const { id: channelId } = await channelService.create({
      projectId,
      name: faker.word.noun(),
      description: faker.lorem.lines(1),
      fields: Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto),
      imageConfig: null,
    });

    channel = await channelService.findById({ channelId });

    fields = await fieldRepo.find({
      where: { channel: { id: channel.id } },
      relations: { options: true },
    });
  });

  it('/channels/:channelId/feedbacks (POST)', () => {
    const dto: Record<string, string | number | string[] | number[]> = {};
    fields
      .filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
      .forEach(({ name, format, options }) => {
        dto[name] = getRandomValue(format, options);
      });

    return request(app.getHttpServer() as Server)
      .post(`/channels/${channel.id}/feedbacks`)
      .send(dto)
      .expect(201)
      .then(
        async ({
          body,
        }: {
          body: Record<string, any> & { issueNames?: string[] };
        }) => {
          expect(body.id).toBeDefined();
          const esResult = await osService.get({
            id: body.id as string,
            index: channel.id.toString(),
          });

          delete esResult.body._source?.[
            (fields.find((v) => v.name === 'createdAt') ?? { id: 0 }).id
          ];
          expect(toApi(dto, fields)).toMatchObject(esResult.body._source ?? {});
        },
      );
  });

  it('/channels/:channelId/feedbacks (GET)', async () => {
    const feedbackCount = faker.number.int({ min: 1, max: 10 });
    const dataset: Record<string, any>[] = [];
    for (let i = 0; i < feedbackCount; i++) {
      const data: Record<string, any> = {};
      fields
        .filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
        .forEach(({ name, format, options }) => {
          data[name] = getRandomValue(format, options);
        });
      await feedbackService.create({ channelId: channel.id, data });
      dataset.push(data);
    }

    return request(app.getHttpServer() as Server)
      .get(`/channels/${channel.id}/feedbacks`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toHaveLength(feedbackCount);
      });
  });

  it('/channels/:channelId/feedbacks/:feedbackId/field/:fieldId (PUT)', async () => {
    const data = {};
    const targetFields = fields.filter(
      ({ name }) => name !== 'createdAt' && name !== 'updatedAt',
    );

    targetFields.forEach(({ name, format, options }) => {
      data[name] = getRandomValue(format, options);
    });

    const { id: feedbackId } = await feedbackService.create({
      channelId: channel.id,
      data,
    });

    const targetField = targetFields[faker.number.int(targetFields.length - 1)];

    const newValue = getRandomValue(targetField.format, targetField.options);

    return request(app.getHttpServer() as Server)
      .put(
        `/channels/${channel.id}/feedbacks/${feedbackId}/field/${targetField.id}`,
      )
      .send({ value: newValue })
      .expect(200)
      .then(async () => {
        const { body } = await osService.get({
          id: feedbackId.toString(),
          index: channel.id.toString(),
        });

        expect(body._source?.[targetField.id]).toEqual(
          targetField.format === FieldFormatEnum.select ?
            ((targetField.options ?? []).find((v) => v.name === newValue) ??
              { id: 0 }.id)
          : newValue,
        );
      });
  });

  //   const channel = await channelModel.create({
  //     name: faker.string.sample(),
  //     description: faker.string.sample(),
  //   });

  //   return request(app.getHttpServer())
  //     .get('/channels/' + channel.id)
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.id).toEqual(channel.id);
  //       expect(body.name).toEqual(channel.name);
  //       expect(body.description).toEqual(channel.description);
  //     });
  // });
  // it('/channels/:id (PUT)', async () => {
  //   const channel = await channelModel.create({
  //     name: faker.string.sample(),
  //     description: faker.string.sample(),
  //   });

  //   await fieldModel.create(
  //     Array.from({ length: faker.number.int({ min: 1, max: 5 }) })
  //       .map(createField)
  //       .map((v) => ({ ...v, channel: { _id: channel.id } })),
  //   );

  //   const dto = new UpdateChannelRequestDto();
  //   dto.name = faker.string.sample();
  //   dto.description = faker.string.sample();
  //   dto.fields = [];

  //   return request(app.getHttpServer())
  //     .put(`/channels/${channel.id}`)
  //     .send(dto)
  //     .expect(200)
  //     .then(async () => {
  //       const updatedchannel = await channelModel.findById(channel.id);
  //       expect(updatedchannel.name).toEqual(dto.name);
  //       expect(updatedchannel.description).toEqual(dto.description);

  //       const fields = await fieldModel.find({ channel: { _id: channel.id } });
  //       expect(fields).toHaveLength(dto.fields.length);
  //     });
  // });
  // it('/channels/:id (DELETE)', async () => {
  //   const channel = await channelModel.create({
  //     name: faker.string.sample(),
  //     description: faker.string.sample(),
  //   });

  //   await request(app.getHttpServer())
  //     .delete(`/channels/${channel.id}`)
  //     .expect(200)
  //     .then(async () => {
  //       expect(await channelModel.findById(channel.id)).toBeNull();
  //     });
  //   expect(await channelModel.findById(channel.id)).toBeNull();
  // });
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
