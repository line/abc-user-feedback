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
import { Logger as DefaultLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { ExternalModule } from './domains/external/external.module';
import type { ConfigServiceType } from './types/config-service.type';

const globalPrefix = 'api';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
    { bufferLogs: true },
  );

  app.enableCors({ origin: '*', exposedHeaders: ['Content-Disposition'] });

  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/external/docs'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useLogger(app.get(Logger));

  const documentConfig = new DocumentBuilder()
    .setTitle('User feedback')
    .setDescription('User feedback API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);

  const externalDocument = SwaggerModule.createDocument(app, documentConfig, {
    include: [ExternalModule],
  });
  SwaggerModule.setup('external-docs', app, externalDocument);

  const configService = app.get(ConfigService<ConfigServiceType>);
  const { port, address } = configService.get('app', { infer: true });

  await app.listen(port, address);
  DefaultLogger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
