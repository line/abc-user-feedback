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
import { AxiosError, AxiosResponse } from 'axios';
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
    const swaggerUrl =
      'https://abc-userfeedback-api-alpha-abc-ufb.app.linecorp-dev.com/docs';
    try {
      await lastValueFrom(this.httpService.head(swaggerUrl));
      console.log(`Swagger URL ${swaggerUrl} is accessible`);
    } catch (e: any) {
      console.error(`HTTPS check failed for ${swaggerUrl}:`, e.message);
    }

    let specUrl = `https://${hostname}/docs-json`;
    try {
      await lastValueFrom(this.httpService.head(specUrl));
    } catch (e: any) {
      // Log the error for debugging purposes
      console.error(`HTTPS check failed for ${specUrl}:`, e.message);

      // Check if the error is due to network issues or 404 status
      if (
        e.response &&
        (e.response.status === 404 || e.response.status === 500)
      ) {
        specUrl = `http://${hostname}/docs-json`;
        try {
          await lastValueFrom(this.httpService.head(specUrl));
        } catch (httpError) {
          console.error(`HTTP check failed for ${specUrl}:`, httpError.message);
          // Handle the case where both HTTPS and HTTP fail
          throw new Error(`Both HTTPS and HTTP checks failed for ${hostname}`);
        }
      } else {
        // Re-throw other types of errors
        console.error('Unknown error!');
        throw e;
      }
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
