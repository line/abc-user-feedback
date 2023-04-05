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
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters';
import {
  CreateChannelRequestDto,
  UpdateChannelRequestDto,
} from '@/domains/feedback/controllers/dtos/requests';
import { ChannelEntity } from '@/domains/feedback/entities/channel.entity';
import { FieldEntity } from '@/domains/feedback/entities/field.entity';
import { OptionEntity } from '@/domains/feedback/entities/option.entity';
import { ProjectEntity } from '@/domains/feedback/entities/project.entity';
import { ChannelService } from '@/domains/feedback/services/channel.service';
import { FieldTypeEnum } from '@/domains/feedback/services/dtos/enums';
import { FIELD_TYPES_TO_MAPPING_TYPES } from '@/domains/feedback/services/field.service';
import { strSort } from '@/utils/sort';
import { createFieldDto, optionSort } from '@/utils/test-util-fixture';
import { DEFAULT_FIELD_COUNT, clearEntities } from '@/utils/test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;

  let channelRepo: Repository<ChannelEntity>;
  let projectRepo: Repository<ProjectEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let optionRepo: Repository<OptionEntity>;

  let esService: ElasticsearchService;
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

    dataSource = module.get(DataSource);

    channelRepo = dataSource.getRepository(ChannelEntity);
    projectRepo = dataSource.getRepository(ProjectEntity);
    fieldRepo = dataSource.getRepository(FieldEntity);
    optionRepo = dataSource.getRepository(OptionEntity);
    esService = module.get(ElasticsearchService);
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
      name: faker.datatype.string(),
      description: faker.datatype.string(),
    });
  });

  it('/projects/:projectId/channels (POST)', () => {
    const fieldCount = faker.datatype.number({ min: 1, max: 10 });

    const dto = new CreateChannelRequestDto();
    dto.name = faker.datatype.string();
    dto.description = faker.datatype.string();
    dto.fields = Array.from({ length: fieldCount }).map((_, i) =>
      createFieldDto({ order: i + 1 }),
    );

    return request(app.getHttpServer())
      .post(`/projects/${project.id}/channels`)
      .send(dto)
      .expect(201)
      .then(async ({ body }) => {
        expect(body.id).toBeDefined();

        const channel = await channelRepo.findOneBy({ id: body.id });
        expect(channel).toBeDefined();
        expect(channel.name).toEqual(dto.name);
        expect(channel.description).toEqual(dto.description);

        const fields = await fieldRepo.find({
          where: { channel: { id: body.id } },
          relations: { options: true },
          order: { order: 'ASC' },
        });

        expect(fields).toHaveLength(fieldCount + DEFAULT_FIELD_COUNT);

        expect(fields.map(fieldEntityToDto2)).toEqual(
          dto.fields
            .concat({
              name: 'createdAt',
              type: FieldTypeEnum.date,
              isAdmin: false,
              isDisabled: false,
              order: dto.fields.length + 1,
              options: undefined,
              description: '',
            })
            .concat({
              name: 'updatedAt',
              type: FieldTypeEnum.date,
              isAdmin: false,
              isDisabled: false,
              order: dto.fields.length + DEFAULT_FIELD_COUNT,
              options: undefined,
              description: '',
            }),
        );

        const result = await esService.indices.get({ index: body.id });
        expect(Object.keys(result.body)[0]).toEqual(body.id);

        Object.entries<{ [x: string]: { type: string } }>(
          result.body[body.id].mappings.properties,
        ).forEach(([fieldId, { type }]) => {
          const field = fields.find(({ id }) => id === fieldId);
          expect(field).toBeDefined();
          expect(FIELD_TYPES_TO_MAPPING_TYPES[field.type]).toEqual(type);
        });
      });
  });

  it('/projects/:projectId/channels (GET)', async () => {
    const total = faker.datatype.number(10);

    await channelRepo.save(
      Array.from({ length: total }).map(() => ({
        name: faker.random.word(),
        description: faker.lorem.lines(1),
        project: { id: project.id },
      })),
    );

    return request(app.getHttpServer())
      .get(`/projects/${project.id}/channels`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('items');
        expect(body).toHaveProperty('meta');

        expect(Array.isArray(body.items)).toEqual(true);
        for (const channel of body.items) {
          expect(channel).toHaveProperty('id');
          expect(channel).toHaveProperty('name');
          expect(channel).toHaveProperty('description');
        }
        expect(body.meta.totalItems).toEqual(total);
      });
  });

  it('/channels/:id (GET)', async () => {
    const channel = await channelRepo.save({
      name: faker.datatype.string(),
      description: faker.datatype.string(),
    });

    return request(app.getHttpServer())
      .get('/channels/' + channel.id)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(channel.id);
        expect(body.name).toEqual(channel.name);
        expect(body.description).toEqual(channel.description);
      });
  });
  it('/channels/:id (PUT)', async () => {
    const fieldCount = faker.datatype.number({ min: 1, max: 10 });

    const { id: channelId } = await channelService.create({
      projectId: project.id,
      name: faker.datatype.string(),
      description: faker.datatype.string(),
      fields: Array.from({ length: fieldCount }).map((_, i) =>
        createFieldDto({ order: i + 1 }),
      ),
    });

    const originalFields = await fieldRepo.find({
      where: { channel: { id: channelId } },
      relations: { options: true },
    });

    const existingFields = originalFields
      .map(fieldEntityToDto)
      .filter((v) => v.name !== 'createdAt' && v.name !== 'updatedAt');

    const newfields = Array.from({ length: fieldCount }).map((_, i) =>
      createFieldDto({ order: i + 1 }),
    );

    const dto = new UpdateChannelRequestDto();
    dto.name = faker.datatype.string();
    dto.description = faker.datatype.string();
    dto.fields = [...existingFields, ...newfields];

    return request(app.getHttpServer())
      .put(`/channels/${channelId}`)
      .send(dto)
      .expect(200)
      .then(async () => {
        const updatedchannel = await channelRepo.findOneBy({ id: channelId });
        expect(updatedchannel.name).toEqual(dto.name);
        expect(updatedchannel.description).toEqual(dto.description);

        const updatedFields = await fieldRepo.find({
          where: { channel: { id: channelId } },
          relations: { options: true },
        });
        expect(updatedFields).toHaveLength(
          originalFields.length + newfields.length,
        );

        const activeFields = updatedFields.filter(
          (v) =>
            !v.isDisabled && v.name !== 'updatedAt' && v.name !== 'createdAt',
        );
        expect(activeFields.length).toEqual(dto.fields.length);

        activeFields.forEach((activeField) => {
          const fieldDto = dto.fields.find((v) => v.name === activeField.name);

          expect(fieldDto).toBeDefined();
          expect(activeField.name).toEqual(fieldDto.name);
          expect(activeField.type).toEqual(fieldDto.type);

          if (activeField.type === FieldTypeEnum.select) {
            expect(
              activeField.options.map((v) => v.name).sort(strSort),
            ).toEqual(fieldDto.options?.map((v) => v.name).sort(strSort));
          }
        });
      });
  });
});

const fieldEntityToDto = (field: FieldEntity) => ({
  id: field.id,
  name: field.name,
  type: field.type,
  isAdmin: field.isAdmin,
  isDisabled: field.isDisabled,
  order: field.order,
  description: field.description,
  options: field.type === FieldTypeEnum.select ? field.options : undefined,
});

const fieldEntityToDto2 = (field: FieldEntity) => ({
  name: field.name,
  type: field.type,
  isAdmin: field.isAdmin,
  isDisabled: field.isDisabled,
  order: field.order,
  description: field.description,
  options:
    field.type === FieldTypeEnum.select
      ? field.options.map(({ name }) => ({ name })).sort(optionSort)
      : undefined,
});
