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

export class FeedbackStatistics1700795163534 implements MigrationInterface {
  name = 'FeedbackStatistics1700795163534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`feedback_statistics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`count\` int NOT NULL DEFAULT '0', \`channel_id\` int NULL, UNIQUE INDEX \`channel-date-unique\` (\`channel_id\`, \`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback_statistics\` ADD CONSTRAINT \`FK_7250a09c7ee486d1d24938a7054\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedback_statistics\` DROP FOREIGN KEY \`FK_7250a09c7ee486d1d24938a7054\``,
    );
    await queryRunner.query(
      `DROP INDEX \`channel-date-unique\` ON \`feedback_statistics\``,
    );
    await queryRunner.query(`DROP TABLE \`feedback_statistics\``);
  }
}
