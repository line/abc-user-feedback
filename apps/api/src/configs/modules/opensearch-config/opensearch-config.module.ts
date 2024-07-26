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
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, NodeOptions } from '@opensearch-project/opensearch';

import type { ConfigServiceType } from '@/types/config-service.type';

@Global()
@Module({
  providers: [
    {
      provide: 'OPENSEARCH_CLIENT',
      useFactory: (
        configService: ConfigService<ConfigServiceType>,
      ): Client | undefined => {
        const {
          use,
          node,
          password,
          username,
        }: {
          use: boolean;
          node: string | string[] | NodeOptions | NodeOptions[];
          password: string;
          username: string;
        } = configService.get('opensearch', {
          infer: true,
        }) ?? { use: false, node: '', password: '', username: '' };
        return use ?
            new Client({ node, auth: { username, password } })
          : undefined;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['OPENSEARCH_CLIENT'],
})
export class OpensearchConfigModule {}
