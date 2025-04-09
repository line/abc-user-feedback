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

export class ModifySchedulerLockEnum1728522901760
  implements MigrationInterface
{
  name = 'ModifySchedulerLockEnum1728522901760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`scheduler_locks\` CHANGE \`lock_type\` \`lock_type\` enum ('FEEDBACK_STATISTICS', 'ISSUE_STATISTICS', 'FEEDBACK_ISSUE_STATISTICS', 'FEEDBACK_COUNT', 'FEEDBACK_DELETE') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`scheduler_locks\` CHANGE \`lock_type\` \`lock_type\` enum ('FEEDBACK_STATISTICS', 'ISSUE_STATISTICS', 'FEEDBACK_ISSUE_STATISTICS', 'FEEDBACK_COUNT') NOT NULL`,
    );
  }
}
