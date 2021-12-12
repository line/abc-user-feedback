import { MigrationInterface, QueryRunner } from 'typeorm'

export class createFeedbackFieldOption1639331759760
  implements MigrationInterface
{
  name = 'createFeedbackFieldOption1639331759760'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackFields\` DROP COLUMN \`option\``
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`feedbackFieldOptions\` (\`id\` char(36) NOT NULL, \`label\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`feedbackFieldId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackFieldOptions\` ADD CONSTRAINT \`FK_6443c00e47b9eb7bf098ae4996b\` FOREIGN KEY (\`feedbackFieldId\`) REFERENCES \`feedbackFields\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackFields\` ADD \`option\` text NOT NULL`
    )

    await queryRunner.query(
      `ALTER TABLE \`feedbackFieldOptions\` DROP FOREIGN KEY \`FK_6443c00e47b9eb7bf098ae4996b\``
    )

    await queryRunner.query(`DROP TABLE IF EXISTS \`feedbackFieldOptions\``)
  }
}
