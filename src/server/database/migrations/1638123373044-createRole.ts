/* */
import { MigrationInterface, QueryRunner } from 'typeorm'

/* */
import { OWNER_KEY, GUEST_KEY } from '@/constant'

export class createRole1638123373044 implements MigrationInterface {
  name = 'createRole1638123373044'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` char(36) NOT NULL, \`name\` varchar(20) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )

    await queryRunner.query(
      `INSERT INTO roles (id, name, description) VALUES(UUID(), ?, '')`,
      [OWNER_KEY]
    )

    await queryRunner.query(
      `INSERT INTO roles (id, name, description) VALUES(UUID(), ?, '')`,
      [GUEST_KEY]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``
    )
    await queryRunner.query(`DROP TABLE \`roles\``)
  }
}
