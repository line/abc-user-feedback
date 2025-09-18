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

import type { CodeTypeEnum } from '@/shared/code/code-type.enum';
import type { CodeEntity } from '@/shared/code/code.entity';

import { codeFixture } from '../fixtures';
import { CommonRepositoryStub } from './common-repository.stub';

export class CodeRepositoryStub extends CommonRepositoryStub<CodeEntity> {
  constructor() {
    super([codeFixture]);
  }

  setNull() {
    this.entities = null;
  }

  setIsVerified(bool: boolean) {
    this.entities?.forEach((entity) => {
      entity.isVerified = bool;
    });
  }

  setType(type: CodeTypeEnum) {
    this.entities?.forEach((entity) => {
      entity.type = type;
    });
  }

  setTryCount(tryCount: number) {
    this.entities?.forEach((entity) => {
      entity.tryCount = tryCount;
    });
  }

  getTryCount(): number {
    return this.entities?.[0]?.tryCount ?? 0;
  }

  setData(data: unknown) {
    this.entities?.forEach((entity) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (entity as any).data = data;
    });
  }
}
