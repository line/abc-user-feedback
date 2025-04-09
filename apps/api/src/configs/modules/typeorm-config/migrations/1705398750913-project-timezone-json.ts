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

export class ProjectTimezoneJson1705398750913 implements MigrationInterface {
  name = 'ProjectTimezoneJson1705398750913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`projects\` CHANGE \`timezone_offset\` \`timezone\` varchar(255) NULL DEFAULT '+00:00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` DROP COLUMN \`timezone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD \`timezone\` varchar(255) NOT NULL DEFAULT '{"countryCode":"KR","name":"Asia/Seoul","offset":"+09:00"}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`projects\` DROP COLUMN \`timezone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD \`timezone\` varchar(255) NULL DEFAULT '+00:00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` CHANGE \`timezone\` \`timezone_offset\` varchar(255) NULL DEFAULT '+00:00'`,
    );
  }
}
