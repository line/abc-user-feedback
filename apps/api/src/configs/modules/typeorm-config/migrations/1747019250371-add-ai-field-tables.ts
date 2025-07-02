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

export class AddAIFieldTables1747019250371 implements MigrationInterface {
  name = 'AddAIFieldTables1747019250371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ai_integrations\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`project_id\` int NOT NULL UNIQUE, 
        \`provider\` enum('OPEN_AI', 'GEMINI') NOT NULL, 
        \`api_key\` varchar(255)  NOT NULL, 
        \`endpoint_url\` varchar(255) DEFAULT NULL, 
        \`system_prompt\` text NOT NULL,
        \`token_threshold\` int NULL DEFAULT NULL,
        \`notification_threshold\` float NULL DEFAULT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` DATETIME(6) DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_integrations\` ADD CONSTRAINT \`FK_project_id\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ai_field_templates\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`project_id\` int NOT NULL,
        \`title\` varchar(255) NOT NULL DEFAULT '',
        \`prompt\` text NOT NULL,
        \`model\` varchar(255) NULL DEFAULT NULL, 
        \`temperature\` float NOT NULL DEFAULT 0.7,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` DATETIME(6) DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\`
       ADD CONSTRAINT \`FK_ai_field_templates_project_id\`
       FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`)
       ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ai_usages\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` DATETIME(6) DEFAULT NULL,
        \`year\` int NOT NULL,
        \`month\` int NOT NULL,
        \`day\` int NOT NULL,
        \`category\` enum('AI_FIELD', 'ISSUE_RECOMMEND') NOT NULL,
        \`provider\` enum('OPEN_AI', 'GEMINI') NOT NULL,
        \`used_tokens\` int NOT NULL,
        \`project_id\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`ai_usages\``);
    await queryRunner.query(
      `ALTER TABLE \`ai_field_templates\` DROP FOREIGN KEY \`FK_ai_field_templates_project_id\``,
    );
    await queryRunner.query(`DROP TABLE \`ai_field_templates\``);
    await queryRunner.query(
      `ALTER TABLE \`ai_integrations\` DROP FOREIGN KEY \`FK_project_id\``,
    );
    await queryRunner.query(`DROP TABLE \`ai_integrations\``);
  }
}
