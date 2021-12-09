import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterResponseKey1639031978786 implements MigrationInterface {
  name = 'alterResponseKey1639031978786'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP FOREIGN KEY \`FK_d386d52f23577587fe06cf3227f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` DROP PRIMARY KEY`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` DROP COLUMN \`id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP COLUMN \`feedbackResponseId\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD \`feedbackResponseId\` int NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD CONSTRAINT \`FK_d386d52f23577587fe06cf3227f\` FOREIGN KEY (\`feedbackResponseId\`) REFERENCES \`feedbackResponses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP FOREIGN KEY \`FK_d386d52f23577587fe06cf3227f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP COLUMN \`feedbackResponseId\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD \`feedbackResponseId\` char(36) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` DROP COLUMN \`id\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` ADD \`id\` char(36) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` ADD PRIMARY KEY (\`id\`)`
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` ADD CONSTRAINT \`FK_d386d52f23577587fe06cf3227f\` FOREIGN KEY (\`feedbackResponseId\`) REFERENCES \`feedbackResponses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
