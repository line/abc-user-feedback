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

import type {
  OAuthConfig,
  TenantEntity,
} from '@/domains/admin/tenant/tenant.entity';
import { tenantFixture } from '../fixtures';
import { CommonRepositoryStub } from './common-repository.stub';

export class TenantRepositoryStub extends CommonRepositoryStub<TenantEntity> {
  constructor() {
    super([tenantFixture]);
  }

  setAllowDomains(domains: string[] = []) {
    const entity = this.entities?.[0];
    if (entity) {
      entity.allowDomains = domains;
    }
  }

  setUseOAuth(bool: boolean, config: OAuthConfig) {
    const entity = this.entities?.[0];

    if (entity) {
      entity.useOAuth = bool;
      entity.oauthConfig = config;
    }
  }
}
