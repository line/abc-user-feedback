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
import multiPart from '@fastify/multipart';
import { Logger as DefaultLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request } from 'express';
import fastify from 'fastify';
import { Logger } from 'nestjs-pino';
import pinoHttp from 'pino-http';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule, domainModules } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { APIModule } from './domains/api/api.module';
import { HealthModule } from './domains/operation/health/health.module';
import { MigrationModule } from './domains/operation/migration/migration.module';
import type { ConfigServiceType } from './types/config-service.type';

const globalPrefix = 'api';

async function bootstrap() {
  initializeTransactionalContext();
  const server = fastify();

  const pino = pinoHttp({
    transport: { target: 'pino-pretty', options: { singleLine: true } },
    serializers: {
      req: (req: Request) => {
        const rawReqRefSymbol = Object.getOwnPropertySymbols(req).find(
          (symbol) => symbol.toString() === 'Symbol(pino-raw-req-ref)',
        );
        type RawRequest = {
          body?: object;
        };
        let body: object | undefined = undefined;
        if (rawReqRefSymbol) {
          body = (req[rawReqRefSymbol] as RawRequest).body;
        }
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          headers: req.headers,
          body,
          params: req.params,
          query: req.query,
        };
      },
    },
  });

  server.addHook('onSend', (request, reply, payload, done) => {
    if (request.body) {
      interface RequestBody {
        password?: string;
        [key: string]: any;
      }

      const sanitizedBody: RequestBody = { ...request.body };
      if (sanitizedBody.password) {
        sanitizedBody.password = '****';
      }

      const sanitizedHeaders = { ...request.headers };
      if (sanitizedHeaders.authorization) {
        sanitizedHeaders.authorization = '****';
      }

      pino.logger.info({
        req: {
          id: request.id,
          method: request.method,
          url: request.url,
          headers: sanitizedHeaders,
          body: sanitizedBody,
          params: request.params,
          query: request.query,
        },
        res: {
          statusCode: reply.statusCode,
        },
      });
    }
    done();
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(server as any),
    { bufferLogs: true },
  );

  await app.register(multiPart);

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Disposition'],
    methods: '*',
  });

  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/docs/redoc'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useLogger(app.get(Logger));

  const adminDocumentConfig = new DocumentBuilder()
    .setTitle('User Feedback Admin API Document')
    .setDescription('User feedback Admin API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey')
    .build();
  const excludeModules = [APIModule, HealthModule, MigrationModule];
  const adminDocument = SwaggerModule.createDocument(app, adminDocumentConfig, {
    include: domainModules.filter((module) => !excludeModules.includes(module)),
  });
  SwaggerModule.setup('admin-docs', app, adminDocument);

  const documentConfig = new DocumentBuilder()
    .setTitle('User Feedback API Document')
    .setDescription(
      `You can use this API to integrate with your own service or system. This API is protected by a simple API key authentication, so please do not expose this API to the public. You can make an API key in the admin setting page. You should put the API key in the header with the key name 'x-api-key'.
      `,
    )
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig, {
    include: [APIModule],
  });
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService<ConfigServiceType>);
  const { port, address }: { port: number; address: string } =
    configService.get('app', { infer: true }) ?? {
      port: 4000,
      address: 'localhost',
    };

  await app.listen(port, address);
  DefaultLogger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
