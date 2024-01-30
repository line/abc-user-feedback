# ABC User Feedback Backend

ABC User Feedback Backend provides API and its related operations. It is built with Node.js, NestJS, Typeorm, and many more.

## Setup

ABC User Feedback is using a mono-repo with multiple packages.

## Useful Targets

You can find a full list of targets in the [package.json](./package.json) file.

### `dev`

Runs the app in development mode.

```
yarn dev
```

### `test`

Executes tests. This command applies to the environment variables in `.env.test` file.

```
yarn test
```

### `test:e2e`

Executes e2e tests. This command applies to the environment variables in `.env.test` file.

```
yarn test:e2e
```

### `lint`

Performs a linting check using ESLint.

```
yarn lint
```

### `build`

Builds the app for production. The distributable is expored to the `dist` folder in the repository's root folder.<br />

```
yarn build
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

| Environment               | Description                                                                      | Default Value                                                      |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| JWT_SECRET                | JWT secret                                                                       | # required                                                         |
| MYSQL_PRIMARY_URL         | mysql url                                                                        | mysql://userfeedback:userfeedback@localhost:13306/userfeedback     |
| MYSQL_SECONDARY_URLS      | mysql sub urls (must be json array format)                                       | ["mysql://userfeedback:userfeedback@localhost:13306/userfeedback"] |
| SMTP_USE                  | flag for using smtp server (for email verification on creating user)             | false                                                              |
| SMTP_HOST                 | smtp server host                                                                 | localhost                                                          |
| SMTP_PORT                 | smtp server port                                                                 | 25                                                                 |
| SMTP_USERNAME             | smtp auth username                                                               |                                                                    |
| SMTP_PASSWORD             | smtp auth password                                                               |                                                                    |
| SMTP_SENDER               | mail sender email                                                                | noreplay@linecorp.com                                              |
| SMTP_BASE_URL             | default UserFeedback URL for mail to be redirected                               | http://localhost:3000                                              |
| APP_PORT                  | the post that the server is running on                                           | 4000                                                               |
| APP_ADDRESS               | the address that the server is running on                                        | 0.0.0.0                                                            |
| OS_USE                    | flag for using opensearch (for better performance on searching feedback)         | false                                                              |
| OS_NODE                   | opensearch node url                                                              | http://localhost:9200                                              |
| OS_USERNAME               | opensearch username if exists                                                    |                                                                    |
| OS_PASSWORD               | opensearch password if exists                                                    |                                                                    |
| AUTO_MIGRATION            | set 'true' if you want to make the database migration automatically              |                                                                    |
| MASTER_API_KEY            | set a key if you want to make a master key for creating feedback                 |                                                                    |
| NODE_OPTIONS              | set some options if you want to add for node execution (e.g. max_old_space_size) |                                                                    |
| ACCESS_TOKEN_EXPIRED_TIME | set expired time of access token                                                 | 10m                                                                |
| REFESH_TOKEN_EXPIRED_TIME | set expired time of refresh token                                                | 1h                                                                 |

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
