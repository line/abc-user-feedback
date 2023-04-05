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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  TestConfigs,
  clearEntities,
  getMockProvider,
} from '@/utils/test-utils';

import {
  GUEST_ROLE,
  OWNER_ROLE,
  OWNER_ROLE_DEFAULT_ID,
} from '../role/role.constant';
import { RoleEntity } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { SetupTenantDto, UpdateTenantDto } from './dtos';
import {
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from './exceptions';
import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';

describe('tenant service', () => {
  let tenantService: TenantService;

  let dataSource: DataSource;
  let tenantRepo: Repository<TenantEntity>;
  let roleRepo: Repository<RoleEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([TenantEntity, RoleEntity]),
      ],
      providers: [TenantService, getMockProvider(RoleService, MockRoleService)],
    }).compile();
    tenantService = module.get(TenantService);

    dataSource = module.get(DataSource);
    tenantRepo = dataSource.getRepository(TenantEntity);
    roleRepo = dataSource.getRepository(RoleEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearEntities([tenantRepo]);
    await roleRepo.save(OWNER_ROLE);
    await roleRepo.save(GUEST_ROLE);
  });

  describe('create tenant', () => {
    it('positive case', async () => {
      const dto = new SetupTenantDto();
      dto.siteName = faker.datatype.string();
      dto.isPrivate = faker.datatype.boolean();
      dto.isRestrictDomain = faker.datatype.boolean();
      dto.allowDomains = [];

      await tenantService.create(dto);

      const tenants = await tenantRepo.find();
      expect(tenants).toHaveLength(1);

      const [tenant] = tenants;
      expect(tenant.siteName).toEqual(dto.siteName);
      expect(tenant.isPrivate).toEqual(dto.isPrivate);
      expect(tenant.isRestrictDomain).toEqual(dto.isRestrictDomain);
      expect(tenant.allowDomains).toEqual(dto.allowDomains);
    });
    it('already exists', async () => {
      await tenantRepo.save({
        siteName: faker.datatype.string(),
        isPrivate: faker.datatype.boolean(),
        isRestrictDomain: faker.datatype.boolean(),
        allowDomains: [],
      });

      const dto = new SetupTenantDto();
      dto.siteName = faker.datatype.string();
      dto.isPrivate = faker.datatype.boolean();
      dto.isRestrictDomain = faker.datatype.boolean();
      dto.allowDomains = [];

      await expect(tenantService.create(dto)).rejects.toThrow(
        TenantAlreadyExistsException,
      );
    });
  });
  describe('update tenant', () => {
    let tenant: TenantEntity;
    let role = new RoleEntity();

    beforeEach(async () => {
      role = await roleRepo.save({
        name: faker.datatype.string(),
        permissions: [],
      });
      jest.spyOn(MockRoleService, 'findById').mockResolvedValue(role);

      tenant = await tenantRepo.save({
        siteName: faker.datatype.string(),
        isPrivate: faker.datatype.boolean(),
        isRestrictDomain: faker.datatype.boolean(),
        allowDomains: [],
      });
    });

    it('positive case', async () => {
      const dto = new UpdateTenantDto();
      dto.id = tenant.id;
      dto.siteName = faker.datatype.string();
      dto.isPrivate = faker.datatype.boolean();
      dto.isRestrictDomain = faker.datatype.boolean();
      dto.allowDomains = [faker.datatype.string()];
      dto.defaultRole = { id: role.id };

      await tenantService.update(dto);

      const updatedTenant = await tenantRepo.findOne({
        where: { id: tenant.id },
        relations: { defaultRole: true },
      });

      expect(updatedTenant.siteName).toEqual(dto.siteName);
      expect(updatedTenant.isPrivate).toEqual(dto.isPrivate);
      expect(updatedTenant.isRestrictDomain).toEqual(dto.isRestrictDomain);
      expect(updatedTenant.allowDomains).toEqual(dto.allowDomains);
      expect(updatedTenant.allowDomains).toEqual(dto.allowDomains);
      expect(updatedTenant.defaultRole.id).toEqual(dto.defaultRole.id);
    });
    it('invalid tenant id', async () => {
      const dto = new UpdateTenantDto();
      dto.id = faker.datatype.uuid();
      dto.siteName = faker.datatype.string();
      dto.isPrivate = faker.datatype.boolean();
      dto.isRestrictDomain = faker.datatype.boolean();
      dto.allowDomains = [faker.datatype.string()];
      dto.defaultRole = { id: role.id };

      await expect(tenantService.update(dto)).rejects.toThrow(
        TenantNotFoundException,
      );
    });
  });
  describe('find tenant by id', () => {
    it('positive case', async () => {
      const tenant = await tenantRepo.save({
        siteName: faker.datatype.string(),
        isPrivate: faker.datatype.boolean(),
        isRestrictDomain: faker.datatype.boolean(),
        allowDomains: [],
        defaultRole: { id: OWNER_ROLE_DEFAULT_ID },
      });

      const res = await tenantService.findOne();
      expect(res.id).toEqual(tenant.id);
      expect(res.siteName).toEqual(tenant.siteName);
      expect(res.isPrivate).toEqual(tenant.isPrivate);
      expect(res.isRestrictDomain).toEqual(tenant.isRestrictDomain);
      expect(res.allowDomains).toEqual(tenant.allowDomains);

      expect(res.defaultRole).toBeDefined();
      const role = await roleRepo.findOneBy({ id: OWNER_ROLE_DEFAULT_ID });
      expect(res.defaultRole.id).toEqual(role.id);
      expect(res.defaultRole.name).toEqual(role.name);
      expect(res.defaultRole.permissions).toEqual(role.permissions);
    });
    it('positive case', async () => {
      await expect(tenantService.findOne()).rejects.toThrow(
        TenantNotFoundException,
      );
    });
  });
});

const MockRoleService = {
  findById: jest.fn(),
};
