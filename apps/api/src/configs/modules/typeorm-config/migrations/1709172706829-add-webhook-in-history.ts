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

export class AddWebhookInHistory1709172706829 implements MigrationInterface {
  name = 'AddWebhookInHistory1709172706829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`histories\` CHANGE \`entity_name\` \`entity_name\` enum ('ApiKey', 'Channel', 'Feedback', 'Field', 'IssueTracker', 'Issue', 'Member', 'Option', 'Project', 'Role', 'Tenant', 'User', 'FeedbackIssue', 'Code', 'Webhook') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`histories\` CHANGE \`entity_name\` \`entity_name\` enum ('ApiKey', 'Channel', 'Feedback', 'Field', 'IssueTracker', 'Issue', 'Member', 'Option', 'Project', 'Role', 'Tenant', 'User', 'FeedbackIssue', 'Code') NOT NULL`,
    );
  }
}
