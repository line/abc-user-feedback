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
import YAML from 'yaml';

import type { AppConfig } from './config';

export function generateComposeContent(cfg: AppConfig) {
  const doc = {
    name: 'abc-user-feedback',
    services: {
      web: {
        image: 'line/abc-user-feedback-web:latest',
        ports: [`${cfg.web.port}:3000`],
        depends_on: { api: { condition: 'service_healthy' } },
        restart: 'unless-stopped',
        environment: [
          `NEXT_PUBLIC_API_BASE_URL=http://localhost:${cfg.api.port}`,
        ],
      },
      api: {
        image: 'line/abc-user-feedback-api:latest',
        environment: [
          `JWT_SECRET=${cfg.api.jwt_secret}`,
          'MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback',
          `SMTP_HOST=${cfg.api.smtp.host}`,
          `SMTP_PORT=${cfg.api.smtp.port}`,
          `SMTP_SENDER=${cfg.api.smtp.sender}`,
        ],
        ports: [`${cfg.api.port}:4000`],
        depends_on: { mysql: { condition: 'service_healthy' } },
        restart: 'unless-stopped',
        healthcheck: {
          test: [
            'CMD-SHELL',
            "node -e \"require('http').get('http://localhost:4000/api/health', res => process.exit(res.statusCode === 200 ? 0 : 1))\"",
          ],
          interval: '10s',
          timeout: '5s',
          retries: '5',
        },
      },
      smtp4dev: {
        image: 'rnwood/smtp4dev:v3',
        ports: ['5080:80', '25:25', '143:143'],
        volumes: ['smtp4dev:/smtp4dev'],
        restart: 'unless-stopped',
      },
      mysql: {
        image: 'mysql:8.0',
        command: [
          '--default-authentication-plugin=mysql_native_password',
          '--collation-server=utf8mb4_bin',
        ],
        environment: {
          MYSQL_ROOT_PASSWORD: 'userfeedback',
          MYSQL_DATABASE: 'userfeedback',
          MYSQL_USER: 'userfeedback',
          MYSQL_PASSWORD: 'userfeedback',
          TZ: 'UTC',
        },
        ports: [`${cfg.mysql?.port}:3306`],
        volumes: ['mysql:/var/lib/mysql'],
        restart: 'unless-stopped',
        healthcheck: {
          test: [
            'CMD',
            'mysqladmin',
            'ping',
            '-h',
            'localhost',
            '-uuserfeedback',
            '-puserfeedback',
          ],
          interval: '10s',
          timeout: '5s',
          retries: '5',
        },
      },
    },
    volumes: { mysql: {}, smtp4dev: {} } as Record<string, object>,
  };

  const apiEnvVariables = {
    MASTER_API_KEY: cfg.api.master_api_key,
    ACCESS_TOKEN_EXPIRED_TIME: cfg.api.access_token_expired_time,
    REFRESH_TOKEN_EXPIRED_TIME: cfg.api.refresh_token_expired_time,
    SMTP_USERNAME: cfg.api.smtp.username,
    SMTP_PASSWORD: cfg.api.smtp.password,
    SMTP_TLS: cfg.api.smtp.tls,
    SMTP_CIPHER_SPEC: cfg.api.smtp.cipher_spec,
    SMTP_OPPORTUNISTIC_TLS: cfg.api.smtp.opportunistic_tls,
    AUTO_FEEDBACK_DELETION_ENABLED: cfg.api.auto_feedback_deletion?.enabled,
    AUTO_FEEDBACK_DELETION_PERIOD_DAYS:
      cfg.api.auto_feedback_deletion?.period_days,
    OPENSEARCH_USE: cfg.api.opensearch?.enabled,
  };

  for (const [key, value] of Object.entries(apiEnvVariables)) {
    if (value !== undefined) {
      doc.services.api.environment.push(`${key}=${value}`);
    }
    if (key === 'OPENSEARCH_USE' && value === true) {
      doc.services.api.environment.push(
        `OPENSEARCH_NODE=http://opensearch-node:9200`,
      );
    }
  }
  if (cfg.mysql) {
    doc.services.mysql = {
      image: 'mysql:8.0',
      command: [
        '--default-authentication-plugin=mysql_native_password',
        '--collation-server=utf8mb4_bin',
      ],
      environment: {
        MYSQL_ROOT_PASSWORD: 'userfeedback',
        MYSQL_DATABASE: 'userfeedback',
        MYSQL_USER: 'userfeedback',
        MYSQL_PASSWORD: 'userfeedback',
        TZ: 'UTC',
      },
      ports: [`${cfg.mysql.port}:3306`],
      volumes: ['mysql:/var/lib/mysql'],
      restart: 'unless-stopped',
      healthcheck: {
        test: [
          'CMD',
          'mysqladmin',
          'ping',
          '-h',
          'localhost',
          '-uuserfeedback',
          '-puserfeedback',
        ],
        interval: '10s',
        timeout: '5s',
        retries: '5',
      },
    };
  }

  if (cfg.api.opensearch) {
    doc.services['opensearch-node'] = {
      image: 'opensearchproject/opensearch:2.16.0',
      restart: 'unless-stopped',
      environment: [
        'cluster.name=opensearch-cluster',
        'node.name=opensearch-node',
        'discovery.type=single-node',
        'bootstrap.memory_lock=true',
        'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m',
        'plugins.security.disabled=true',
        'OPENSEARCH_INITIAL_ADMIN_PASSWORD=UserFeedback123!@#',
      ],
      ulimits: {
        memlock: { soft: -1, hard: -1 },
        nofile: { soft: 65536, hard: 65536 },
      },
      volumes: ['opensearch:/usr/share/opensearch/data'],
      ports: ['9200:9200', '9600:9600'],
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:9200/_cluster/health'],
        interval: '10s',
        timeout: '5s',
        retries: '5',
      },
    };
    doc.services.api.depends_on['opensearch-node'] = {
      condition: 'service_healthy',
    };
    doc.volumes.opensearch = {};

    doc.services['opensearch-dashboards'] = {
      image: 'opensearchproject/opensearch-dashboards:2.16.0',
      restart: 'unless-stopped',
      ports: ['5601:5601'],
      environment: [
        'OPENSEARCH_HOSTS=["http://opensearch-node:9200"]',
        'DISABLE_SECURITY_DASHBOARDS_PLUGIN=true',
      ],
      depends_on: {
        'opensearch-node': {
          condition: 'service_healthy',
        },
      },
    };
  }

  const yml = YAML.stringify(doc);
  return yml;
}
