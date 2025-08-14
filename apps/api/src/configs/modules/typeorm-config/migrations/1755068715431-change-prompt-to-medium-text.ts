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

export class ChangePromptToMediumText1755068715431
  implements MigrationInterface
{
  name = 'ChangePromptToMediumText1755068715431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\`
        MODIFY COLUMN \`prompt\` mediumtext NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_integrations\`
        MODIFY COLUMN \`system_prompt\` mediumtext NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\`
        MODIFY COLUMN \`prompt\` mediumtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\`
        MODIFY COLUMN \`prompt\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_integrations\`
        MODIFY COLUMN \`system_prompt\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\`
        MODIFY COLUMN \`prompt\` text NOT NULL`,
    );
  }
}
