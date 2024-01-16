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
import { tenantFixture } from '../fixtures';
import { createQueryBuilder } from '../util-functions';

export class TenantRepositoryStub {
  tenant = tenantFixture;
  findOne() {
    return this.tenant;
  }

  findOneBy() {
    return this.tenant;
  }

  find() {
    return [this.tenant];
  }

  findBy() {
    return [this.tenant];
  }

  findAndCount() {
    return [[this.tenant], 1];
  }

  findAndCountBy() {
    return [[this.tenant], 1];
  }

  save(tenant) {
    return { ...tenant, id: tenantFixture.id };
  }

  count() {
    return 1;
  }

  setIsRestrictDomain(bool, domains = []) {
    this.tenant.isRestrictDomain = bool;
    this.tenant.allowDomains = domains;
  }

  setIsPrivate(bool) {
    this.tenant.isPrivate = bool;
  }

  setUseOAuth(bool, config) {
    this.tenant.useOAuth = bool;
    this.tenant.oauthConfig = config;
  }

  setNull() {
    this.tenant = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [tenantFixture];
    return createQueryBuilder;
  }
}
