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

| Environment         | Description                               | Default Value                                                  |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| JWT_SECRET          | JWT secret                                | # required                                                     |
| MYSQL_PRIMARY_URL   | mysql url                                 | mysql://userfeedback:userfeedback@localhost:13306/userfeedback |
| MYSQL_SECONDARY_URL | mysql url                                 | mysql://userfeedback:userfeedback@localhost:13306/userfeedback |
| SMTP_HOST           | smtp server host                          | localhost                                                      |
| SMTP_PORT           | smtp server port                          | 25                                                             |
| SMTP_USERNAME       | smtp auth username                        |                                                                |
| SMTP_PASSWORD       | smtp auth password                        |                                                                |
| SMTP_SENDER         | mail sender email                         | noreplay@linecorp.com                                          |
| SMTP_BASE_URL       | 메일에서 리다이렉트할 기본 유저피드백 URL | http://localhost:3000                                          |
| APP_PORT            | the post that the server is running on    | 4000                                                           |
| APP_ADDRESS         | the address that the server is running on | 0.0.0.0                                                        |
| ES_NODE             | elasticsearch node url                    | http://localhost:9200                                          |
| ES_USERNAME         | elasticsearch username if exists          |                                                                |
| ES_PASSWORD         | elasticsearch password if exists          |                                                                |

## Learn More

To learn NestJS, check out the [NestJS documentation](https://nestjs.com/).
