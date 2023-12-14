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
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class IssueStatistics1701090850194 implements MigrationInterface {
  name = 'IssueStatistics1701090850194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`issue_statistics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`count\` int NOT NULL DEFAULT '0', \`project_id\` int NULL, UNIQUE INDEX \`project-date-unique\` (\`project_id\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`issue_statistics\` ADD CONSTRAINT \`FK_86e6ee861d8895004659b4fe076\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`issue_statistics\` DROP FOREIGN KEY \`FK_86e6ee861d8895004659b4fe076\``,
    );
    await queryRunner.query(
      `DROP INDEX \`project-date-unique\` ON \`issue_statistics\``,
    );
    await queryRunner.query(`DROP TABLE \`issue_statistics\``);
  }
}
