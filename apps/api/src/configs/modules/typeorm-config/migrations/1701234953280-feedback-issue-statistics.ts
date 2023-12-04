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

export class FeedbackIssueStatistics1701234953280
  implements MigrationInterface
{
  name = 'FeedbackIssueStatistics1701234953280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feedback_issue_statistics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`feedback_count\` int NOT NULL DEFAULT '0', \`issue_id\` int NULL, UNIQUE INDEX \`issue-date-unique\` (\`issue_id\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback_issue_statistics\` ADD CONSTRAINT \`FK_f90e8299de4ac2a05d3b6cbb2a6\` FOREIGN KEY (\`issue_id\`) REFERENCES \`issues\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedback_issue_statistics\` DROP FOREIGN KEY \`FK_f90e8299de4ac2a05d3b6cbb2a6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`issue-date-unique\` ON \`feedback_issue_statistics\``,
    );
    await queryRunner.query(`DROP TABLE \`feedback_issue_statistics\``);
  }
}
