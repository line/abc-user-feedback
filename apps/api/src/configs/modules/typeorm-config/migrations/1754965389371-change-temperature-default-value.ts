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

export class ChangeTemperatureDefaultValue1754965389371
  implements MigrationInterface
{
  name = 'ChangeTemperatureDefaultValue1754965389371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\`
        MODIFY COLUMN \`temperature\` float NOT NULL DEFAULT 0.5`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\`
        MODIFY COLUMN \`temperature\` float NOT NULL DEFAULT 0.5`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\`
        MODIFY COLUMN \`temperature\` float NOT NULL DEFAULT 0.7`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\`
        MODIFY COLUMN \`temperature\` float NOT NULL DEFAULT 0.7`,
    );
  }
}
