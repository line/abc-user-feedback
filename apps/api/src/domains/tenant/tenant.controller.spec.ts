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
import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';

import { getMockProvider } from '@/utils/test-utils';

import { SetupTenantRequestDto } from './dtos/requests';
import { UpdateTenantRequestDto } from './dtos/requests/update-service-request.dto';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('Tenant Controller', () => {
  let controller: TenantController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [getMockProvider(TenantService, MockTenantService)],
      controllers: [TenantController],
    }).compile();
    controller = module.get(TenantController);
  });

  it('to be defined', () => {
    expect(controller).toBeDefined();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('', () => {
    const objectId = new mongoose.Types.ObjectId('63b50da88e5344079dc58e8e');
    expect(objectId.toString()).toEqual('63b50da88e5344079dc58e8e');
    expect(objectId.toHexString()).toEqual('63b50da88e5344079dc58e8e');
  });
  it('setup', async () => {
    const dto = new SetupTenantRequestDto();
    await controller.setup(dto);

    expect(MockTenantService.create).toBeCalledTimes(1);
    expect(MockTenantService.create).toBeCalledWith(dto);
  });
  it('update', async () => {
    const dto = new UpdateTenantRequestDto();
    await controller.update(dto);
    expect(MockTenantService.update).toBeCalledTimes(1);
    expect(MockTenantService.update).toBeCalledWith(dto);
  });
  it('find', async () => {
    jest.spyOn(MockTenantService, 'findOne').mockResolvedValue({
      _id: new mongoose.Types.ObjectId('63b50da88e5344079dc58e8e'),
      id: '63b50da88e5344079dc58e8e',
      siteName: 'tw`1\\=&`1M',
      isPrivate: true,
      isRestrictDomain: true,
      allowDomains: [],
      defaultRole: {
        _id: new mongoose.Types.ObjectId('63b50da88e5344079dc58e8c'),
        id: '63b50da88e5344079dc58e8c',
        name: 'owner',
        permissions: [
          'service_management',
          'role_management',
          'user_management',
          'project_management',
        ],
        __v: 0,
      },
      __v: 0,
    });
    const res = await controller.get();
    expect(MockTenantService.findOne).toBeCalledTimes(1);
    expect(res).toMatchObject(
      expect.objectContaining({
        id: '63b50da88e5344079dc58e8e',
        siteName: 'tw`1\\=&`1M',
        isPrivate: true,
        isRestrictDomain: true,
        allowDomains: [],
        defaultRole: {
          id: '63b50da88e5344079dc58e8c',
          name: 'owner',
          permissions: [
            'service_management',
            'role_management',
            'user_management',
            'project_management',
          ],
        },
      }),
    );
  });
});

const MockTenantService = {
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
};
