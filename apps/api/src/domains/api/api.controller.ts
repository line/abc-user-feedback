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
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { lastValueFrom } from 'rxjs';

@Controller()
@ApiExcludeController()
export class APIController {
  constructor(private readonly httpService: HttpService) {}

  @Get('docs/redoc')
  async getAPIDocs(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const { hostname } = request;
    let specUrl = `https://${hostname}/docs-json`;
    try {
      await lastValueFrom(this.httpService.head(specUrl));
    } catch (e) {
      specUrl = `http://${hostname}/docs-json`;
    }

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
    reply.type('text/html').send(html);
  }
}
