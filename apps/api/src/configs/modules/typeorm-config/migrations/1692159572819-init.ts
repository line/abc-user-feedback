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
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1692159572819 implements MigrationInterface {
  name = 'Init1692159572819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tenant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`site_name\` varchar(50) NOT NULL, \`description\` varchar(255) NULL, \`use_email\` tinyint NOT NULL DEFAULT 1, \`is_private\` tinyint NOT NULL DEFAULT 0, \`is_restrict_domain\` tinyint NOT NULL DEFAULT 0, \`allow_domains\` text NULL, \`use_o_auth\` tinyint NOT NULL DEFAULT 0, \`oauth_config\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`issues\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`status\` enum ('INIT', 'ON_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'PENDING') NOT NULL DEFAULT 'INIT', \`external_issue_id\` varchar(255) NULL, \`feedback_count\` int NOT NULL DEFAULT '0', \`project_id\` int NULL, INDEX \`IDX_b7fd6df20da19c630741ea9045\` (\`status\`), INDEX \`IDX_db94fcc9ef9f968b43ec5d2b2a\` (\`feedback_count\`), INDEX \`IDX_8e64309f790aa4270b955a9947\` (\`project_id\`, \`created_at\`), UNIQUE INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`feedbacks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`raw_data\` json NOT NULL, \`additional_data\` json NULL, \`channel_id\` int NULL, INDEX \`IDX_a640975f8ccf17d9337d4ff828\` (\`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`field_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`fields\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`format\` enum ('text', 'keyword', 'number', 'boolean', 'select', 'multiSelect', 'date') NOT NULL, \`type\` enum ('DEFAULT', 'ADMIN', 'API') NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL, \`channel_id\` int NULL, INDEX \`IDX_4b2181db660323e7ae856adeae\` (\`created_at\`), UNIQUE INDEX \`field-name-unique\` (\`name\`, \`channel_id\`), UNIQUE INDEX \`field-key-unique\` (\`key\`, \`channel_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`channels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`project_id\` int NULL, INDEX \`IDX_1233531abfb8d56d2a15050143\` (\`name\`, \`created_at\`), UNIQUE INDEX \`project-name-unique\` (\`name\`, \`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`tenant_id\` int NULL, UNIQUE INDEX \`IDX_2187088ab5ef2a918473cb9900\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`permissions\` text NOT NULL, \`project_id\` int NULL, INDEX \`IDX_f4f2789197a3cbbc0182396b26\` (\`name\`, \`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`role_id\` int NULL, \`user_id\` int NULL, UNIQUE INDEX \`IDX_858f5ec01bcfe14ab3f2a328dc\` (\`role_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(320) NULL, \`name\` varchar(255) NULL, \`department\` varchar(255) NULL, \`state\` enum ('Active', 'Blocked') NOT NULL DEFAULT 'Active', \`hash_password\` varchar(255) NULL, \`type\` enum ('SUPER', 'GENERAL') NOT NULL DEFAULT 'GENERAL', \`sign_up_method\` enum ('EMAIL', 'OAUTH') NOT NULL DEFAULT 'EMAIL', UNIQUE INDEX \`IDX_1301b11757c5b489adc8bc05e4\` (\`email\`, \`sign_up_method\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`histories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`entity_name\` enum ('ApiKey', 'Channel', 'Feedback', 'Field', 'IssueTracker', 'Issue', 'Member', 'Option', 'Project', 'Role', 'Tenant', 'User', 'FeedbackIssue', 'Code') NOT NULL, \`entity_id\` decimal NOT NULL, \`action\` enum ('Create', 'Update', 'Delete', 'SoftDelete', 'Download', 'Recover') NOT NULL, \`entity\` json NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`codes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`type\` enum ('EMAIL_VEIRIFICATION', 'RESET_PASSWORD', 'USER_INVITATION') NOT NULL, \`key\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`data\` varchar(255) NULL, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`api_keys\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`value\` varchar(255) NOT NULL, \`project_id\` int NULL, UNIQUE INDEX \`IDX_2662a95fc4dd64493ca686a82f\` (\`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`issue_trackers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`data\` json NULL, \`project_id\` int NULL, UNIQUE INDEX \`REL_0d000918b0c670b7d2488257dd\` (\`project_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`feedbacks_issues_issues\` (\`feedbacks_id\` int NOT NULL, \`issues_id\` int NOT NULL, INDEX \`IDX_3435079c319679ba3aaccd806b\` (\`feedbacks_id\`), INDEX \`IDX_6d6f24cf306a31c0af7b50973a\` (\`issues_id\`), PRIMARY KEY (\`feedbacks_id\`, \`issues_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`issues\` ADD CONSTRAINT \`FK_11f35e8296e10c229e7b68c68d4\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`FK_4adbe5e6c46eba8a93a0265a078\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` ADD CONSTRAINT \`FK_dc520ce6f54769336c4afa5e9b9\` FOREIGN KEY (\`field_id\`) REFERENCES \`fields\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` ADD CONSTRAINT \`FK_da856f4b147eb542917c5968c43\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`channels\` ADD CONSTRAINT \`FK_63c4e21cafd9504a7c139144d1c\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_7393a03ef67e2ea91b81faa95dd\` FOREIGN KEY (\`tenant_id\`) REFERENCES \`tenant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_cb48212dfe65dfe431d486034d2\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`members\` ADD CONSTRAINT \`FK_274c5ebb3c595f5a56f1f8fba9a\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`members\` ADD CONSTRAINT \`FK_da404b5fd9c390e25338996e2d1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_f5de07dbb229225e2be643ff3d0\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`issue_trackers\` ADD CONSTRAINT \`FK_0d000918b0c670b7d2488257dd7\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks_issues_issues\` ADD CONSTRAINT \`FK_3435079c319679ba3aaccd806b1\` FOREIGN KEY (\`feedbacks_id\`) REFERENCES \`feedbacks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks_issues_issues\` ADD CONSTRAINT \`FK_6d6f24cf306a31c0af7b50973ab\` FOREIGN KEY (\`issues_id\`) REFERENCES \`issues\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbacks_issues_issues\` DROP FOREIGN KEY \`FK_6d6f24cf306a31c0af7b50973ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks_issues_issues\` DROP FOREIGN KEY \`FK_3435079c319679ba3aaccd806b1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`issue_trackers\` DROP FOREIGN KEY \`FK_0d000918b0c670b7d2488257dd7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_f5de07dbb229225e2be643ff3d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_da404b5fd9c390e25338996e2d1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`members\` DROP FOREIGN KEY \`FK_274c5ebb3c595f5a56f1f8fba9a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_cb48212dfe65dfe431d486034d2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_7393a03ef67e2ea91b81faa95dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`channels\` DROP FOREIGN KEY \`FK_63c4e21cafd9504a7c139144d1c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`fields\` DROP FOREIGN KEY \`FK_da856f4b147eb542917c5968c43\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` DROP FOREIGN KEY \`FK_dc520ce6f54769336c4afa5e9b9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_4adbe5e6c46eba8a93a0265a078\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`issues\` DROP FOREIGN KEY \`FK_11f35e8296e10c229e7b68c68d4\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6d6f24cf306a31c0af7b50973a\` ON \`feedbacks_issues_issues\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3435079c319679ba3aaccd806b\` ON \`feedbacks_issues_issues\``,
    );
    await queryRunner.query(`DROP TABLE \`feedbacks_issues_issues\``);
    await queryRunner.query(
      `DROP INDEX \`REL_0d000918b0c670b7d2488257dd\` ON \`issue_trackers\``,
    );
    await queryRunner.query(`DROP TABLE \`issue_trackers\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2662a95fc4dd64493ca686a82f\` ON \`api_keys\``,
    );
    await queryRunner.query(`DROP TABLE \`api_keys\``);
    await queryRunner.query(`DROP TABLE \`codes\``);
    await queryRunner.query(`DROP TABLE \`histories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_1301b11757c5b489adc8bc05e4\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_858f5ec01bcfe14ab3f2a328dc\` ON \`members\``,
    );
    await queryRunner.query(`DROP TABLE \`members\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f4f2789197a3cbbc0182396b26\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2187088ab5ef2a918473cb9900\` ON \`projects\``,
    );
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(
      `DROP INDEX \`project-name-unique\` ON \`channels\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1233531abfb8d56d2a15050143\` ON \`channels\``,
    );
    await queryRunner.query(`DROP TABLE \`channels\``);
    await queryRunner.query(`DROP INDEX \`field-key-unique\` ON \`fields\``);
    await queryRunner.query(`DROP INDEX \`field-name-unique\` ON \`fields\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4b2181db660323e7ae856adeae\` ON \`fields\``,
    );
    await queryRunner.query(`DROP TABLE \`fields\``);
    await queryRunner.query(`DROP TABLE \`options\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a640975f8ccf17d9337d4ff828\` ON \`feedbacks\``,
    );
    await queryRunner.query(`DROP TABLE \`feedbacks\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` ON \`issues\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8e64309f790aa4270b955a9947\` ON \`issues\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_db94fcc9ef9f968b43ec5d2b2a\` ON \`issues\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b7fd6df20da19c630741ea9045\` ON \`issues\``,
    );
    await queryRunner.query(`DROP TABLE \`issues\``);
    await queryRunner.query(`DROP TABLE \`tenant\``);
  }
}
