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

import type { TransportTargetOptions } from 'pino';

/**
 * Creates a pino transport configuration for OpenTelemetry log export.
 * The endpoint URL should be set via OTEL_EXPORTER_OTLP_LOGS_ENDPOINT environment variable.
 * @returns pino transport configuration
 */
export function createOtelLogTransport(): TransportTargetOptions {
  return {
    target: 'pino-opentelemetry-transport',
    options: {
      loggerName: 'abc-user-feedback-api',
      serviceVersion: '1.0.0',
      exporterProtocol: 'http',
      resourceAttributes: {
        'service.name': 'abc-user-feedback-api',
        'service.type': 'api',
      },
    },
  };
}
