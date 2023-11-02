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
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectEntity } from '@/domains/project/project/project.entity';
import { mockRepository } from '@/test-utils/util-functions';
import { ApiKeyEntity } from '../../domains/project/api-key/api-key.entity';
import { ApiKeyService } from '../../domains/project/api-key/api-key.service';

export const ApiKeyServiceProviders = [
  ApiKeyService,
  {
    provide: getRepositoryToken(ApiKeyEntity),
    useValue: mockRepository(),
  },
  {
    provide: getRepositoryToken(ProjectEntity),
    useValue: mockRepository(),
  },
];
