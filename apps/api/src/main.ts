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
import { Logger } from 'nestjs-pino';
import pinoHttp from 'pino-http';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule, domainModules } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { createOtelLogTransport } from './configs/otel-log.config';
import { APIModule } from './domains/api/api.module';
import { HealthModule } from './domains/operation/health/health.module';
import { MigrationModule } from './domains/operation/migration/migration.module';
import type { ConfigServiceType } from './types/config-service.type';

const globalPrefix = 'api';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  await app.register(multiPart);

  const configService = app.get(ConfigService<ConfigServiceType>);
  const appConfig = configService.get('app', { infer: true }) ?? {
    port: 4000,
    address: 'localhost',
    baseUrl: undefined,
    otelLogExportEnabled: false,
  };

  let transport: any = { target: 'pino-pretty', options: { singleLine: true } };

  if (appConfig.otelLogExportEnabled) {
    const otelTransport = createOtelLogTransport();
    transport = {
      targets: [
        { target: 'pino-pretty', options: { singleLine: true } },
        otelTransport,
      ],
    };
  }

  const pino = pinoHttp({
    transport,
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

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (request, reply, payload, done) => {
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

  const baseUrl = appConfig.baseUrl;

  const adminDocumentConfigBuilder = new DocumentBuilder()
    .setTitle('User Feedback Admin API Document')
    .setDescription('User feedback Admin API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey');
  if (baseUrl) {
    adminDocumentConfigBuilder.addServer(baseUrl);
  }
  const adminDocumentConfig = adminDocumentConfigBuilder.build();
  const excludeModules = [APIModule, HealthModule, MigrationModule];
  const adminDocument = SwaggerModule.createDocument(app, adminDocumentConfig, {
    include: domainModules.filter((module) => !excludeModules.includes(module)),
  });
  SwaggerModule.setup('admin-docs', app, adminDocument);

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
  SwaggerModule.setup('docs', app, document);

  const { port, address }: { port: number; address: string } = {
    port: appConfig.port ? Number(appConfig.port) : 4000,
    address: appConfig.address ?? 'localhost',
  };

  await app.listen(port, address);
  DefaultLogger.log(`🚀 Application is running on: ${await app.getUrl()}`);

  if (process.env.REFESH_TOKEN_EXPIRED_TIME) {
    DefaultLogger.warn(
      '⚠️  Environment variable name has changed: REFESH_TOKEN_EXPIRED_TIME -> REFRESH_TOKEN_EXPIRED_TIME',
    );
    DefaultLogger.warn(
      `   Current value in use: ${process.env.REFESH_TOKEN_EXPIRED_TIME}`,
    );
    DefaultLogger.warn(
      '   Please update the environment variable name to REFRESH_TOKEN_EXPIRED_TIME.',
    );
    DefaultLogger.warn('   The old environment variable is no longer used.');
  }

  if (process.env.ENABLE_AUTO_FEEDBACK_DELETION) {
    DefaultLogger.warn(
      '⚠️  Environment variable name has changed: ENABLE_AUTO_FEEDBACK_DELETION -> AUTO_FEEDBACK_DELETION_ENABLED',
    );
    DefaultLogger.warn(
      `   Current value in use: ${process.env.ENABLE_AUTO_FEEDBACK_DELETION}`,
    );
    DefaultLogger.warn(
      '   Please update the environment variable name to AUTO_FEEDBACK_DELETION_ENABLED.',
    );
    DefaultLogger.warn('   The old environment variable is no longer used.');
  }

  if (process.env.SMTP_BASE_URL) {
    DefaultLogger.warn(
      '⚠️  Environment variable name has changed: SMTP_BASE_URL -> ADMIN_WEB_URL',
    );
    DefaultLogger.warn(
      `   Current SMTP_BASE_URL value: ${process.env.SMTP_BASE_URL}`,
    );
    DefaultLogger.warn(
      '   Please update to use ADMIN_WEB_URL instead of SMTP_BASE_URL.',
    );
    DefaultLogger.warn('   The old environment variable is no longer used.');
  }
}

void bootstrap();
