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
import { getDataSourceToken } from '@nestjs/typeorm';
import { Client } from '@opensearch-project/opensearch';
import type { Indices_Get_Response } from '@opensearch-project/opensearch/api/indices/get';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { HttpExceptionFilter } from '@/common/filters';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import {
  CreateChannelRequestDto,
  UpdateChannelRequestDto,
} from '@/domains/admin/channel/channel/dtos/requests';
import type { CreateChannelResponseDto } from '@/domains/admin/channel/channel/dtos/responses/create-channel-response.dto';
import type { FindChannelByIdResponseDto } from '@/domains/admin/channel/channel/dtos/responses/find-channel-by-id-response.dto';
import type { FindChannelsByProjectIdResponseDto } from '@/domains/admin/channel/channel/dtos/responses/find-channels-by-id-response.dto';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import { FIELD_TYPES_TO_MAPPING_TYPES } from '@/domains/admin/channel/field/field.service';
import { OptionEntity } from '@/domains/admin/channel/option/option.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { createFieldDto, optionSort } from '@/test-utils/fixtures';
import {
  clearEntities,
  DEFAULT_FIELD_COUNT,
} from '@/test-utils/util-functions';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;

  let channelRepo: Repository<ChannelEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let optionRepo: Repository<OptionEntity>;

  let osService: Client;
  let channelService: ChannelService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    await app.init();

    dataSource = module.get(getDataSourceToken());

    channelRepo = dataSource.getRepository(ChannelEntity);
    projectRepo = dataSource.getRepository(ProjectEntity);
    fieldRepo = dataSource.getRepository(FieldEntity);
    optionRepo = dataSource.getRepository(OptionEntity);
    osService = module.get(Client);
    channelService = module.get(ChannelService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  let project: ProjectEntity;

  beforeEach(async () => {
    await clearEntities([projectRepo, channelRepo, fieldRepo, optionRepo]);

    project = await projectRepo.save({
      name: faker.string.sample(),
      description: faker.string.sample(),
    });
  });

  it('/projects/:projectId/channels (POST)', () => {
    const fieldCount = faker.number.int({ min: 1, max: 10 });

    const dto = new CreateChannelRequestDto();
    dto.name = faker.string.sample();
    dto.description = faker.string.sample();
    dto.fields = Array.from({ length: fieldCount }).map((_) =>
      createFieldDto({}),
    );

    return request(app.getHttpServer() as Server)
      .post(`/projects/${project.id}/channels`)
      .send(dto)
      .expect(201)
      .then(async ({ body }: { body: CreateChannelResponseDto }) => {
        expect(body.id).toBeDefined();

        const channel = await channelRepo.findOneBy({
          id: body.id,
        });
        expect(channel).toBeDefined();
        if (channel === null) {
          throw new Error('Channel not found');
        }
        expect(channel.name).toEqual(dto.name);
        expect(channel.description).toEqual(dto.description);

        const fields = await fieldRepo.find({
          where: { channel: { id: body.id } },
          relations: { options: true },
        });

        expect(fields).toHaveLength(fieldCount + DEFAULT_FIELD_COUNT);

        expect(fields.map(fieldEntityToDto2)).toEqual(
          dto.fields
            .concat({
              name: 'createdAt',
              key: 'createdAt',
              format: FieldFormatEnum.date,
              property: FieldPropertyEnum.READ_ONLY,
              status: FieldStatusEnum.ACTIVE,
              options: undefined,
              description: '',
            })
            .concat({
              name: 'updatedAt',
              key: 'updatedAt',
              format: FieldFormatEnum.date,
              property: FieldPropertyEnum.READ_ONLY,
              status: FieldStatusEnum.ACTIVE,
              options: undefined,
              description: '',
            }),
        );

        const result: Indices_Get_Response = await osService.indices.get({
          index: body.id.toString(),
        });
        expect(Object.keys(result.body)[0]).toEqual(body.id);

        Object.entries<Record<string, { type: string }>>(
          result.body[body.id].mappings?.properties as
            | Record<string, Record<string, { type: string }>>
            | ArrayLike<Record<string, { type: string }>>,
        ).forEach(([fieldId, { type }]) => {
          const field =
            fields.find(({ id }) => id === parseInt(fieldId)) ??
            new FieldEntity();
          expect(field).toBeDefined();
          expect(FIELD_TYPES_TO_MAPPING_TYPES[field.format]).toEqual(type);
        });
      });
  });

  it('/projects/:projectId/channels (GET)', async () => {
    const total = faker.number.int(10);

    await channelRepo.save(
      Array.from({ length: total }).map(() => ({
        name: faker.word.noun(),
        description: faker.lorem.lines(1),
        project: { id: project.id },
      })),
    );

    return request(app.getHttpServer() as Server)
      .get(`/projects/${project.id}/channels`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('items');
        expect(body).toHaveProperty('meta');

        expect(
          Array.isArray((body as FindChannelsByProjectIdResponseDto).items),
        ).toEqual(true);
        for (const channel of (body as FindChannelsByProjectIdResponseDto)
          .items) {
          expect(channel).toHaveProperty('id');
          expect(channel).toHaveProperty('name');
          expect(channel).toHaveProperty('description');
        }
        expect(
          (body as FindChannelsByProjectIdResponseDto).meta.totalItems,
        ).toEqual(total);
      });
  });

  it('/channels/:id (GET)', async () => {
    const channel = await channelRepo.save({
      name: faker.string.sample(),
      description: faker.string.sample(),
    });

    return request(app.getHttpServer() as Server)
      .get('/channels/' + channel.id)
      .expect(200)
      .expect(({ body }) => {
        expect((body as FindChannelByIdResponseDto).id).toEqual(channel.id);
        expect((body as FindChannelByIdResponseDto).name).toEqual(channel.name);
        expect((body as FindChannelByIdResponseDto).description).toEqual(
          channel.description,
        );
      });
  });
  it('/channels/:id (PUT)', async () => {
    const fieldCount = faker.number.int({ min: 1, max: 10 });

    const { id: channelId } = await channelService.create({
      projectId: project.id,
      name: faker.string.sample(),
      description: faker.string.sample(),
      fields: Array.from({ length: fieldCount }).map((_) => createFieldDto({})),
      imageConfig: null,
    });

    const originalFields = await fieldRepo.find({
      where: { channel: { id: channelId } },
      relations: { options: true },
    });

    // const existingFields = originalFields
    //   .map(fieldEntityToDto)
    //   .filter((v) => v.name !== 'createdAt' && v.name !== 'updatedAt');

    const newfields = Array.from({ length: fieldCount }).map((_) =>
      createFieldDto({}),
    );

    const dto = new UpdateChannelRequestDto();
    dto.name = faker.string.sample();
    dto.description = faker.string.sample();
    // dto.fields = [...existingFields, ...newfields];

    return request(app.getHttpServer() as Server)
      .put(`/channels/${channelId}`)
      .send(dto)
      .expect(200)
      .then(async () => {
        const updatedchannel = await channelRepo.findOneBy({ id: channelId });
        expect(updatedchannel?.name).toEqual(dto.name);
        expect(updatedchannel?.description).toEqual(dto.description);

        const updatedFields = await fieldRepo.find({
          where: { channel: { id: channelId } },
          relations: { options: true },
        });
        expect(updatedFields).toHaveLength(
          originalFields.length + newfields.length,
        );

        // const activeFields = updatedFields.filter(
        //   (v) =>
        //     v.status === FieldStatusEnum.ACTIVE &&
        //     v.name !== 'updatedAt' &&
        //     v.name !== 'createdAt',
        // );
        // expect(activeFields.length).toEqual(dto.fields.length);

        // activeFields.forEach((activeField) => {
        //   const fieldDto = dto.fields.find((v) => v.name === activeField.name);

        //   expect(fieldDto).toBeDefined();
        //   expect(activeField.name).toEqual(fieldDto.name);
        //   expect(activeField.type).toEqual(fieldDto.type);

        //   if (activeField.format === FieldFormatEnum.select) {
        //     expect(
        //       activeField.options.map((v) => v.name).sort(strSort),
        //     ).toEqual(fieldDto.options?.map((v) => v.name).sort(strSort));
        //   }
        // });
      });
  });
});

// const fieldEntityToDto = (field: FieldEntity) => ({
//   id: field.id,
//   name: field.name,
//   key: field.key,
//   format: field.format,
//   type: field.type,
//   status: field.status,
//   description: field.description,
//   options: field.format === FieldFormatEnum.select ? field.options : undefined,
// });

const fieldEntityToDto2 = (field: FieldEntity) => ({
  name: field.name,
  format: field.format,
  property: field.property,
  status: field.status,
  description: field.description,
  options:
    field.format === FieldFormatEnum.select ?
      (field.options ?? []).map(({ name }) => ({ name })).sort(optionSort)
    : undefined,
});
