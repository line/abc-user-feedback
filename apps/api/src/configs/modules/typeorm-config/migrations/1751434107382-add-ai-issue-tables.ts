import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAiIssueTables1751434107382 implements MigrationInterface {
  name = 'AddAiIssueTables1751434107382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ai_issue_templates\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`channel_id\` int NOT NULL,
        \`target_field_keys\` json NOT NULL, 
        \`prompt\` text NOT NULL,
        \`is_enabled\` tinyint NOT NULL DEFAULT 1,
        \`model\` varchar(255) NULL DEFAULT NULL, 
        \`temperature\` float NOT NULL DEFAULT 0.7,
        \`data_reference_amount\` int NOT NULL DEFAULT 3,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` DATETIME(6) DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\`
       ADD CONSTRAINT \`FK_ai_issue_templates_channel_id\`
       FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`)
       ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ai_issue_templates\` DROP FOREIGN KEY \`FK_ai_issue_templates_channel_id\``,
    );
    await queryRunner.query(`DROP TABLE \`ai_issue_templates\``);
  }
}
