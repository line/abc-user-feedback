# ABC User Feedback Backend

ABC User Feedback Backend provides API and its related operations. It is built with Node.js, NestJS, Typeorm, and many more.

## Setup

ABC User Feedback is using a mono-repo with multiple packages.

## Useful Targets

You can find a full list of targets in the [package.json](./package.json) file.

### `dev`

Runs the app in development mode.

```
pnpm dev
```

### `test`

Executes tests. This command applies to the environment variables in `.env.test` file.

```
pnpm test
```

### `test:e2e`

Executes e2e tests. This command applies to the environment variables in `.env.test` file.

```
pnpm test:e2e
```

### `lint`

Performs a linting check using ESLint.

```
pnpm lint
```

### `build`

Builds the app for production. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
pnpm build
```

### `migration:generate`

Generate the migration file using typeorm. The file is generated in `src/configs/modules/typeorm-config/migrations`

```
npm run migration:generate --name={NAME}
```

### `migration:run`

Run the migration files for database migrations

```
npm run migration:run
```

## Environment Variables

The following is a list of environment variables used by the application, along with their descriptions and default values.

### Required Environment Variables

| Environment         | Description                                  | Default Value |
| ------------------- | -------------------------------------------- | ------------- |
| `JWT_SECRET`        | Secret key for signing JSON Web Tokens (JWT) | _required_    |
| `MYSQL_PRIMARY_URL` | Primary MySQL connection URL                 | _required_    |
| `SMTP_HOST`         | SMTP server host                             | _required_    |
| `SMTP_PORT`         | SMTP server port                             | _required_    |
| `SMTP_SENDER`       | Email address used as sender in emails       | _required_    |

### Optional Environment Variables

| Environment                          | Description                                                    | Default Value                                  |
| ------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------- |
| `ADMIN_WEB_URL`                      | Admin Web URL                                                  | `http://localhost:3000`                        |
| `APP_PORT`                           | The port that the server runs on                               | `4000`                                         |
| `APP_ADDRESS`                        | The address that the server binds to                           | `0.0.0.0`                                      |
| `MYSQL_SECONDARY_URLS`               | Secondary MySQL connection URLs (must be in JSON array format) | _optional_                                     |
| `SMTP_USERNAME`                      | SMTP server authentication username                            | _optional_                                     |
| `SMTP_PASSWORD`                      | SMTP server authentication password                            | _optional_                                     |
| `SMTP_TLS`                           | Flag to enable SMTP server with secure option                  | `false`                                        |
| `SMTP_CIPHER_SPEC`                   | SMTP Cipher Algorithm Specification                            | `TLSv1.2`                                      |
| `SMTP_OPPORTUNISTIC_TLS`             | Use Opportunistic TLS using STARTTLS                           | `true`                                         |
| `OPENSEARCH_USE`                     | Flag to enable OpenSearch integration                          | `false`                                        |
| `OPENSEARCH_NODE`                    | OpenSearch node URL                                            | _required if `OPENSEARCH_USE=true`_            |
| `OPENSEARCH_USERNAME`                | OpenSearch username (if authentication is enabled)             | ""                                             |
| `OPENSEARCH_PASSWORD`                | OpenSearch password (if authentication is enabled)             | ""                                             |
| `AUTO_MIGRATION`                     | Automatically perform database migration on application start  | `true`                                         |
| `MASTER_API_KEY`                     | Master API key for privileged operations                       | _none_                                         |
| `AUTO_FEEDBACK_DELETION_ENABLED`     | Enable auto old feedback deletion cron on application start    | `false`                                        |
| `AUTO_FEEDBACK_DELETION_PERIOD_DAYS` | Auto old feedback deletion period (in days)                    | _required if `AUTO_FEEDBACK_DELETION_ENABLED`_ |
| `ACCESS_TOKEN_EXPIRED_TIME`          | Duration until the access token expires                        | `10m`                                          |
| `REFRESH_TOKEN_EXPIRED_TIME`         | Duration until the refresh token expires                       | `1h`                                           |

Please ensure that you set the required environment variables before starting the application. Optional variables can be set as needed based on your specific configuration and requirements.

## Swagger

The swagger documentation can be found on the `/docs` endpoint.

## Dashboard statistics data migration

Dashboard data is generated by mysql data every AM 00:00 with the timezone set by its project with schedulers.
The schedulers generate data for 365 days.
If you want to generate dashboard data by yourself, you can use `/migration/statistics` APIs (ref: [migration API](./src/domains/migration/migration.controller.ts))
With the APIs you can generate data which are inserted more than 365 days.

If you are willing to change the project's timezone, you can manually change it in mysql database. (it is not available in admin web as it is not a usual case.)
Then you should delete all statistics data and re-genearte by migration APIs.

## Learn More

To learn NestJS, check out the [NestJS documentation](https://nestjs.com/).
