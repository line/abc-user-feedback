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
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters';
import { ChannelEntity } from '@/domains/feedback/entities/channel.entity';
import { FieldEntity } from '@/domains/feedback/entities/field.entity';
import { ProjectEntity } from '@/domains/feedback/entities/project.entity';
import { ChannelService } from '@/domains/feedback/services/channel.service';
import { FieldTypeEnum } from '@/domains/feedback/services/dtos';
import { FeedbackService } from '@/domains/feedback/services/feedback.service';
import { ProjectService } from '@/domains/feedback/services/project.service';
import { createFieldDto, getRandomValue } from '@/utils/test-util-fixture';
import { clearEntities } from '@/utils/test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let projectService: ProjectService;
  let channelService: ChannelService;
  let feedbackService: FeedbackService;

  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let esService: ElasticsearchService;

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
    esService = module.get(ElasticsearchService);
  });

  afterAll(async () => {
    await app.close();
  });

  let channel: ChannelEntity;
  let fields: FieldEntity[];
  beforeEach(async () => {
    await clearEntities([projectRepo, channelRepo, fieldRepo]);
    const { id: projectId } = await projectService.create({
      name: faker.random.word(),
      description: faker.lorem.lines(1),
    });

    channel = await channelService.create({
      projectId,
      name: faker.random.alphaNumeric(20),
      description: faker.lorem.lines(1),
      fields: Array.from({
        length: faker.datatype.number({ min: 1, max: 10 }),
      }).map(createFieldDto),
    });

    fields = await fieldRepo.find({
      where: { channel: { id: channel.id } },
      relations: { options: true },
    });
  });

  it('/channels/:channelId/feedbacks (POST)', () => {
    const dto = {};
    fields
      .filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
      .forEach(({ name, type, options }) => {
        dto[name] = getRandomValue(type, options);
      });

    return request(app.getHttpServer())
      .post(`/channels/${channel.id}/feedbacks`)
      .send(dto)
      .expect(201)
      .then(async ({ body }) => {
        expect(body.id).toBeDefined();
        const esResult = await esService.get({
          id: body.id,
          index: channel.id,
        });

        delete esResult.body._source[
          fields.find((v) => v.name === 'createdAt').id
        ];
        expect(toApi(dto, fields)).toMatchObject(esResult.body._source);
      });
  });

  it('/channels/:channelId/feedbacks (GET)', async () => {
    const feedbackCount = faker.datatype.number({ min: 1, max: 10 });
    const dataset = [];
    for (let i = 0; i < feedbackCount; i++) {
      const data = {};
      fields
        .filter(({ name }) => name !== 'createdAt' && name !== 'updatedAt')
        .forEach(({ name, type, options }) => {
          data[name] = getRandomValue(type, options);
        });
      await feedbackService.create({ channelId: channel.id, data });
      dataset.push(data);
    }

    return request(app.getHttpServer())
      .get(`/channels/${channel.id}/feedbacks`)
      .expect(200)
      .then(async ({ body }) => {
        expect(Array.isArray(body)).toEqual(true);
        expect(body).toHaveLength(feedbackCount);
      });
  });

  it('/channels/:channelId/feedbacks/:feedbackId/field/:fieldId (PUT)', async () => {
    const data = {};
    const targetFields = fields.filter(
      ({ name }) => name !== 'createdAt' && name !== 'updatedAt',
    );

    targetFields.forEach(({ name, type, options }) => {
      data[name] = getRandomValue(type, options);
    });

    const { id: feedbackId } = await feedbackService.create({
      channelId: channel.id,
      data,
    });

    const targetField =
      targetFields[faker.datatype.number(targetFields.length - 1)];

    const newValue = getRandomValue(targetField.type, targetField.options);

    return request(app.getHttpServer())
      .put(
        `/channels/${channel.id}/feedbacks/${feedbackId}/field/${targetField.id}`,
      )
      .send({ value: newValue })
      .expect(200)
      .then(async () => {
        const { body } = await esService.get({
          id: feedbackId,
          index: channel.id,
        });

        expect(body._source[targetField.id]).toEqual(
          targetField.type === FieldTypeEnum.select
            ? targetField.options.find((v) => v.name === newValue).id
            : newValue,
        );
      });
  });

  //   const channel = await channelModel.create({
  //     name: faker.datatype.string(),
  //     description: faker.datatype.string(),
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
  //     name: faker.datatype.string(),
  //     description: faker.datatype.string(),
  //   });

  //   await fieldModel.create(
  //     Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) })
  //       .map(createField)
  //       .map((v) => ({ ...v, channel: { _id: channel.id } })),
  //   );

  //   const dto = new UpdateChannelRequestDto();
  //   dto.name = faker.datatype.string();
  //   dto.description = faker.datatype.string();
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
  //     name: faker.datatype.string(),
  //     description: faker.datatype.string(),
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

const toApi = (data: Record<string, any>, fields: FieldEntity[]) => {
  return Object.entries(data).reduce((prev, [key, value]) => {
    const field = fields.find((v) => v.name === key);
    return Object.assign(prev, {
      [field.id]:
        field.type === FieldTypeEnum.select
          ? field.options?.find((v) => v.name === value).id
          : value,
    });
  }, {});
};
