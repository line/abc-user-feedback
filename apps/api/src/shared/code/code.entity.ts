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
import { Column, Entity } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { CodeTypeEnum } from './code-type.enum';

@Entity('codes')
export class CodeEntity extends CommonEntity {
  @Column('enum', { enum: CodeTypeEnum })
  type: CodeTypeEnum;

  @Column('varchar')
  key: string;

  @Column('varchar')
  code: string;

  @Column('varchar', {
    nullable: true,
    transformer: {
      from: (v) => (v ? JSON.parse(v) : v),
      to: (v) => (v ? JSON.stringify(v) : v),
    },
  })
  data: any;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('datetime')
  expiredAt: Date;
}
