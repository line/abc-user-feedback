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

export class CreateCategoryTable1737437203196 implements MigrationInterface {
  name = 'CreateCategoryTable1737437203196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            project_id INT NOT NULL,
            created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            deleted_at DATETIME(6) DEFAULT NULL
        );`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`category-name-unique\` ON \`categories\` (\`project_id\`, \`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` 
       ADD CONSTRAINT \`fk_categories_project\` 
       FOREIGN KEY (\`project_id\`) 
       REFERENCES \`projects\`(\`id\`) 
       ON DELETE CASCADE ON UPDATE CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE \`issues\`
       ADD COLUMN \`category_id\` INT NULL,
       ADD CONSTRAINT \`fk_category\`
       FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`)
       ON DELETE SET NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`issues\`
       DROP FOREIGN KEY \`fk_category\`,
       DROP COLUMN \`category_id\`;`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` DROP FOREIGN KEY \`fk_categories_project\``,
    );
    await queryRunner.query(
      `DROP INDEX \`category-name-unique\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
  }
}
