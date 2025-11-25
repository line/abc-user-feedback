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
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { ConfigServiceType } from '@/types/config-service.type';

@Controller()
@ApiExcludeController()
export class APIController {
  constructor(
    private readonly configService: ConfigService<ConfigServiceType>,
  ) {}

  @Get('docs/redoc')
  getAPIDocs(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const { hostname } = request;
    const appConfig = this.configService.get('app', { infer: true });
    const baseUrl = appConfig?.baseUrl;

    const specUrl =
      baseUrl ? `${baseUrl}/docs-json` : `//${hostname}/docs-json`;

    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Redoc</title>
        <!-- needed for adaptive design -->
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    
        <!--
        Redoc doesn't change outer page styles
        -->
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url='${specUrl}'></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
      </body>
    </html>`;
    void reply.type('text/html').send(html);
  }
}
