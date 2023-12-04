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
import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssueNameUnique1692690482919 implements MigrationInterface {
  name = 'IssueNameUnique1692690482919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` ON \`issues\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`issue-name-unique\` ON \`issues\` (\`name\`, \`project_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`issue-name-unique\` ON \`issues\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` ON \`issues\` (\`name\`)`,
    );
  }
}
