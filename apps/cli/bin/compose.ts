import YAML from 'yaml';

import type { AppConfig } from './config';

export function generateComposeContent(cfg: AppConfig) {
  const doc = {
    services: {
      web: {
        container_name: 'ufb-web',
        image: 'line/abc-user-feedback-web:latest',
        ports: [`${cfg.web.port}:3000`],
        depends_on: { api: { condition: 'service_healthy' } },
        restart: 'unless-stopped',
      },
      api: {
        container_name: 'ufb-api',
        image: 'line/abc-user-feedback-api:latest',
        environment: [
          `JWT_SECRET=${cfg.api.jwt_secret}`,
          'MYSQL_PRIMARY_URL=mysql://userfeedback:userfeedback@mysql:3306/userfeedback',
          `SMTP_HOST=${cfg.api.smtp.host}`,
          `SMTP_PORT=${cfg.api.smtp.port}`,
          `SMTP_SENDER=${cfg.api.smtp.sender}`,
          `BASE_URL=http://localhost:3000`,
          `SMTP_BASE_URL=http://localhost:3000`,
          `OPENSEARCH_USERNAME=""`,
          `OPENSEARCH_PASSWORD=""`,
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
        container_name: 'ufb-smtp',
        image: 'rnwood/smtp4dev:v3',
        ports: ['5080:80', '25:25', '143:143'],
        volumes: ['smtp4dev:/smtp4dev'],
        restart: 'unless-stopped',
      },
      mysql: {
        container_name: 'ufb-db',
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
      },
    },
    volumes: { mysql: {}, smtp4dev: {} },
  };

  const apiEnvVariables = {
    MASTER_API_KEY: cfg.api.master_api_key,
    ACCESS_TOKEN_EXPIRED_TIME: cfg.api.access_token_expired_time,
    REFRESH_TOKEN_EXPIRED_TIME: cfg.api.refresh_token_expired_time,
    SMTP_USERNAME: cfg.api.smtp?.username,
    SMTP_PASSWORD: cfg.api.smtp?.password,
    SMTP_TLS: cfg.api.smtp?.tls,
    SMTP_CIPHER_SPEC: cfg.api.smtp?.cipher_spec,
    SMTP_OPPORTUNISTIC_TLS: cfg.api.smtp?.opportunistic_tls,
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
      console.log('value: ', value);
      doc.services.api.environment.push(
        `OPENSEARCH_NODE=http://opensearch:9200`,
      );
    }
  }

  if (cfg.api.opensearch) {
    doc.services['opensearch-node'] = {
      container_name: 'ufb-opensearch',
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
    doc.volumes!['opensearch'] = {};
  }

  const yml = YAML.stringify(doc);
  return yml;
}
