import { MigrationInterface, QueryRunner } from 'typeorm';

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
