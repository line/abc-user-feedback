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
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { CreateOptionRequestDto } from './dtos/requests';
import { OptionController } from './option.controller';
import { OptionEntity } from './option.entity';
import { OptionService } from './option.service';

const MockSelectOptionService = {
  findByFieldId: jest.fn(),
  create: jest.fn(),
};

describe('SelectOptionController', () => {
  let optionController: OptionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [
        getMockProvider(OptionService, MockSelectOptionService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    optionController = module.get<OptionController>(OptionController);
  });

  it('getOptions', async () => {
    const options = [new OptionEntity()];
    jest
      .spyOn(MockSelectOptionService, 'findByFieldId')
      .mockReturnValue(options);
    const fieldId = faker.number.int();
    await optionController.getOptions(fieldId);
    expect(MockSelectOptionService.findByFieldId).toHaveBeenCalledTimes(1);
  });
  it('creaetOption', async () => {
    const fieldId = faker.number.int();
    const dto = new CreateOptionRequestDto();
    dto.name = faker.string.sample();
    await optionController.createOption(fieldId, dto);
    expect(MockSelectOptionService.create).toHaveBeenCalledTimes(1);
  });
});
