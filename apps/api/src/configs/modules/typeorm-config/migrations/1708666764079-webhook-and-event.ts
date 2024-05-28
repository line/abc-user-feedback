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

export class WebhookAndEvent1708666764079 implements MigrationInterface {
  name = 'WebhookAndEvent1708666764079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', \`type\` enum ('FEEDBACK_CREATION', 'ISSUE_CREATION', 'ISSUE_STATUS_CHANGE', 'ISSUE_ADDITION') NOT NULL, \`webhook_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`webhooks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', \`project_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`events_channels_channels\` (\`events_id\` int NOT NULL, \`channels_id\` int NOT NULL, INDEX \`IDX_97c39787187b453ae616ae1cb5\` (\`events_id\`), INDEX \`IDX_47c9e3e834366fe3217b6d2741\` (\`channels_id\`), PRIMARY KEY (\`events_id\`, \`channels_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD CONSTRAINT \`FK_81282a308a195ff5a7e6ba54fc3\` FOREIGN KEY (\`webhook_id\`) REFERENCES \`webhooks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`webhooks\` ADD CONSTRAINT \`FK_8b545b4c86913152b9da6e04b08\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_channels_channels\` ADD CONSTRAINT \`FK_97c39787187b453ae616ae1cb58\` FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_channels_channels\` ADD CONSTRAINT \`FK_47c9e3e834366fe3217b6d2741f\` FOREIGN KEY (\`channels_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events_channels_channels\` DROP FOREIGN KEY \`FK_47c9e3e834366fe3217b6d2741f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_channels_channels\` DROP FOREIGN KEY \`FK_97c39787187b453ae616ae1cb58\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`webhooks\` DROP FOREIGN KEY \`FK_8b545b4c86913152b9da6e04b08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_81282a308a195ff5a7e6ba54fc3\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_47c9e3e834366fe3217b6d2741\` ON \`events_channels_channels\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97c39787187b453ae616ae1cb5\` ON \`events_channels_channels\``,
    );
    await queryRunner.query(`DROP TABLE \`events_channels_channels\``);
    await queryRunner.query(`DROP TABLE \`webhooks\``);
    await queryRunner.query(`DROP TABLE \`events\``);
  }
}
