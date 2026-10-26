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

/**
 * Replaces plain-text API keys with their SHA-256 digest (hex), keeps the
 * first 4 characters as a display prefix, and adds an optional expiry.
 *
 * Existing keys keep working because the API hashes the presented key the same
 * way (see api-key.util.ts). Raw keys cannot be recovered afterwards, so
 * `down` restores the schema only; restore a backup to get the raw keys back.
 */
export class HashApiKeys1792972800000 implements MigrationInterface {
  name = 'HashApiKeys1792972800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`api_keys\`
        ADD \`prefix\` varchar(8) NOT NULL DEFAULT '',
        ADD \`expires_at\` datetime NULL`,
    );
    // A SHA-256 hex digest is 64 characters and raw keys are 20, so the length
    // check keeps a re-run from hashing a hash.
    await queryRunner.query(
      `UPDATE \`api_keys\` SET \`prefix\` = LEFT(\`value\`, 4)
        WHERE CHAR_LENGTH(\`value\`) <> 64`,
    );
    await queryRunner.query(
      `UPDATE \`api_keys\` SET \`value\` = SHA2(\`value\`, 256)
        WHERE CHAR_LENGTH(\`value\`) <> 64`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` ALTER COLUMN \`prefix\` DROP DEFAULT`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2662a95fc4dd64493ca686a82f\` ON \`api_keys\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` CHANGE \`value\` \`hash\` varchar(64) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_598a14447f592c12d1fe22ba91\` ON \`api_keys\` (\`hash\`)`,
    );
    // History snapshots of api keys were stored with the raw key in them.
    await queryRunner.query(
      `UPDATE \`histories\` SET \`entity\` = JSON_REMOVE(\`entity\`, '$.value')
        WHERE \`entity_name\` = 'ApiKey'
          AND JSON_CONTAINS_PATH(\`entity\`, 'one', '$.value')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_598a14447f592c12d1fe22ba91\` ON \`api_keys\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` CHANGE \`hash\` \`value\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_2662a95fc4dd64493ca686a82f\` ON \`api_keys\` (\`value\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` DROP COLUMN \`expires_at\`, DROP COLUMN \`prefix\``,
    );
  }
}
