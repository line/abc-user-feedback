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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { SMTP_USE } from '@/configs/smtp.config';

import { FeedbackEntity } from '../feedback/feedback.entity';
import { UserTypeEnum } from '../user/entities/enums';
import { UserEntity } from '../user/entities/user.entity';
import {
  FeedbackCountByTenantIdDto,
  SetupTenantDto,
  UpdateTenantDto,
} from './dtos';
import {
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from './exceptions';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: Repository<FeedbackEntity>,
  ) {}

  @Transactional()
  async create(dto: SetupTenantDto) {
    const [tenant] = await this.tenantRepo.find({ take: 1 });
    if (tenant) throw new TenantAlreadyExistsException();
    const newTenant = new TenantEntity();

    await this.tenantRepo.save(Object.assign(newTenant, dto));
    const user = new UserEntity();
    user.email = 'user@feedback.com';
    user.hashPassword =
      '$2b$10$87iuFh.Yty8esbdmuB4bz.NNVh0thMWtf0MPfajzqjvxHfRf6zR0C';
    user.type = UserTypeEnum.SUPER;
    await this.userRepo.save(user);
  }

  @Transactional()
  async update(dto: UpdateTenantDto) {
    const tenant = await this.findOne();
    await this.tenantRepo.save(Object.assign(tenant, dto));
  }

  async findOne() {
    const [tenant] = await this.tenantRepo.find();
    if (!tenant) throw new TenantNotFoundException();

    return { ...tenant, useEmailVerification: SMTP_USE };
  }

  async countByTenantId(dto: FeedbackCountByTenantIdDto) {
    return {
      total: await this.feedbackRepo.count({
        where: { channel: { project: { tenant: { id: dto.tenantId } } } },
      }),
    };
  }
}
