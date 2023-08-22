# ABC User Feedback Server

ABC User Feedback Server is the main component that provides critical back-end functionality to support the operation of the platform.

The server is built with the following awesome open source technologies: Node.js, NestJS, Typeorm, and many more.

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

| Environment          | Description                                                                      | Default Value                                                      |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| JWT_SECRET           | JWT secret                                                                       | # required                                                         |
| MYSQL_PRIMARY_URL    | mysql url                                                                        | mysql://userfeedback:userfeedback@localhost:13306/userfeedback     |
| MYSQL_SECONDARY_URLS | mysql sub urls (must be json array format)                                       | ["mysql://userfeedback:userfeedback@localhost:13306/userfeedback"] |
| SMTP_HOST            | smtp server host                                                                 | localhost                                                          |
| SMTP_PORT            | smtp server port                                                                 | 25                                                                 |
| SMTP_USERNAME        | smtp auth username                                                               |                                                                    |
| SMTP_PASSWORD        | smtp auth password                                                               |                                                                    |
| SMTP_SENDER          | mail sender email                                                                | noreplay@linecorp.com                                              |
| SMTP_BASE_URL        | default UserFeedback URL for mail to be redirected                               | http://localhost:3000                                              |
| APP_PORT             | the post that the server is running on                                           | 4000                                                               |
| APP_ADDRESS          | the address that the server is running on                                        | 0.0.0.0                                                            |
| OS_NODE              | opensearch node url                                                              | http://localhost:9200                                              |
| OS_USERNAME          | opensearch username if exists                                                    |                                                                    |
| OS_PASSWORD          | opensearch password if exists                                                    |                                                                    |
| AUTO_MIGRATION       | set 'true' if you want to make the database migration automatically              |                                                                    |
| MASTER_API_KEY       | set a key if you want to make a master key for creating feedback                 |                                                                    |
| NODE_OPTIONS         | set some options if you want to add for node execution (e.g. max_old_space_size) |                                                                    |
| TZ                   | set timezone of the mysql database server if it is not UTC (e.g. +09:00)         |                                                                    |

## Learn More

To learn NestJS, check out the [NestJS documentation](https://nestjs.com/).
