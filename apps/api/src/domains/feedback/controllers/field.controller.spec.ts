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
import { Test } from '@nestjs/testing';

import { getMockProvider } from '@/utils/test-utils';

import { FieldEntity } from '../entities/field.entity';
import { FieldService } from '../services/field.service';
import { FieldController } from './field.controller';

describe('FieldController', () => {
  let fieldController: FieldController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FieldController],
      providers: [getMockProvider(FieldService, MockFieldService)],
    }).compile();

    fieldController = module.get<FieldController>(FieldController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const channelId = faker.datatype.uuid();
      const fields = [new FieldEntity()];
      jest.spyOn(MockFieldService, 'findByChannelId').mockReturnValue(fields);
      await fieldController.findByChannelId(channelId);
      expect(MockFieldService.findByChannelId).toBeCalledTimes(1);
    });
  });
});

const MockFieldService = {
  findByChannelId: jest.fn(),
};
