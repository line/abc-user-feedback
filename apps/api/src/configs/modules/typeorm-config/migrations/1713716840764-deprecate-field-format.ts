/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

export class DeprecateFieldFormat1713716840764 implements MigrationInterface {
  name = 'DeprecateFieldFormat1713716840764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`feedbacks\` ADD \`data\` json`);
    await queryRunner.query(
      `UPDATE \`feedbacks\` SET \`data\` = JSON_MERGE(COALESCE(\`raw_data\`, '{}'), COALESCE(\`additional_data\`, '{}'))`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` CHANGE \`data\` \`data\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` DROP COLUMN \`raw_data\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` DROP COLUMN \`additional_data\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`fields\` ADD \`property\` enum ('READ_ONLY', 'EDITABLE')`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`property\` = 'EDITABLE' WHERE \`type\` = 'ADMIN'`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`property\` = 'EDITABLE' WHERE \`type\` = 'DEFAULT' AND \`key\` = 'issues'`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`property\` = 'READ_ONLY' WHERE \`type\` = 'API'`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`property\` = 'READ_ONLY' WHERE \`type\` = 'DEFAULT' AND \`key\` IN ('id', 'createdAt', 'updatedAt')`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` CHANGE \`property\` \`property\` enum ('READ_ONLY', 'EDITABLE') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`fields\` DROP COLUMN \`type\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD \`additional_data\` json NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD \`raw_data\` json NULL`,
    );
    await queryRunner.query(`UPDATE \`feedbacks\` SET \`raw_data\` = \`data\``);
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` CHANGE \`raw_data\` \`raw_data\` json NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`feedbacks\` DROP COLUMN \`data\``);

    await queryRunner.query(
      `ALTER TABLE \`fields\` ADD \`type\` enum ('DEFAULT', 'ADMIN', 'API')`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`type\` = 'ADMIN' WHERE \`property\` = 'EDITABLE'`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`type\` = 'API' WHERE \`property\` = 'READ_ONLY'`,
    );
    await queryRunner.query(
      `UPDATE \`fields\` SET \`type\` = 'DEFAULT' WHERE \`key\` IN ('id', 'createdAt', 'updatedAt', 'issues')`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` CHANGE \`type\` \`type\` enum ('DEFAULT', 'ADMIN', 'API') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`fields\` DROP COLUMN \`property\``);
  }
}
