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

export class ChangeFieldsKeyNameCollate1726022408533
  implements MigrationInterface
{
  name = 'ChangeFieldsKeyNameCollate1726022408533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` MODIFY COLUMN \`key\` VARCHAR(255) COLLATE utf8mb4_bin`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` MODIFY COLUMN \`name\` VARCHAR(255) COLLATE utf8mb4_bin;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` MODIFY COLUMN \`key\` VARCHAR(255) COLLATE utf8mb4_0900_ai_ci`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` MODIFY COLUMN \`name\` VARCHAR(255) COLLATE utf8mb4_0900_ai_ci`,
    );
  }
}
