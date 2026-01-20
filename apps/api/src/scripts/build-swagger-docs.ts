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
import { writeFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '../app.module';
import { APIModule } from '../domains/api/api.module';
import type { ConfigServiceType } from '../types/config-service.type';

async function generateSwaggerDoc() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
    { bufferLogs: true },
  );

  const configService = app.get(ConfigService<ConfigServiceType>);
  const appConfig = configService.get('app', { infer: true }) ?? {
    baseUrl: undefined,
  };
  const baseUrl = appConfig.baseUrl;

  const documentConfigBuilder = new DocumentBuilder()
    .setTitle('User Feedback API Document')
    .setDescription(
      `You can use this API to integrate with your own service or system. This API is protected by a simple API key authentication, so please do not expose this API to the public. You can make an API key in the admin setting page. You should put the API key in the header with the key name 'x-api-key'.
      `,
    )
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey');
  if (baseUrl) {
    documentConfigBuilder.addServer(baseUrl);
  }
  const documentConfig = documentConfigBuilder.build();
  const document = SwaggerModule.createDocument(app, documentConfig, {
    include: [APIModule],
  });
  writeFileSync('./swagger.json', JSON.stringify(document));
  await app.close();
}

void generateSwaggerDoc();
