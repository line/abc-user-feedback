import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1676888279999 implements MigrationInterface {
  name = 'migrations1676888279999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` CHANGE \`type\` \`type\` enum ('text', 'number', 'boolean', 'select', 'date') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fields\` CHANGE \`type\` \`type\` enum ('text', 'number', 'boolean', 'select') NOT NULL`,
    );
  }
}
