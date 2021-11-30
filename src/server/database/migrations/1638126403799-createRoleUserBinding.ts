import { MigrationInterface, QueryRunner } from 'typeorm'

export class createRoleUserBinding1638126403799 implements MigrationInterface {
  name = 'createRoleUserBinding1638126403799'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`roleUserBindings\` (\`id\` char(36) NOT NULL, \`userId\` char(36) NOT NULL, \`roleId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )

    await queryRunner.query(
      `ALTER TABLE \`roles\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`
    )
    await queryRunner.query(`DROP TABLE \`roleUserBindings\``)
  }
}
