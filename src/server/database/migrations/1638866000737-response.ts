import { MigrationInterface, QueryRunner } from 'typeorm'

export class response1638866000737 implements MigrationInterface {
  name = 'response1638866000737'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP COLUMN \`value\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD \`value\` varchar(10000) NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP COLUMN \`value\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD \`value\` varchar(1000) NOT NULL`
    )
  }
}
