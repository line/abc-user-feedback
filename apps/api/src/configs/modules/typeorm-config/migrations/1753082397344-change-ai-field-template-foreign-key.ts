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

export class ChangeAiFieldTemplateForeignKey1753082397344
  implements MigrationInterface
{
  name = 'ChangeAiFieldTemplateForeignKey1753082397344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` DROP FOREIGN KEY \`FK_fields_ai_field_template_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` ADD CONSTRAINT \`FK_fields_ai_field_template_id\` FOREIGN KEY (\`ai_field_template_id\`) REFERENCES \`ai_field_templates\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` DROP FOREIGN KEY \`FK_fields_ai_field_template_id\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`fields\` ADD CONSTRAINT \`FK_fields_ai_field_template_id\` FOREIGN KEY (\`ai_field_template_id\`) REFERENCES \`ai_field_templates\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
