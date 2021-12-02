/* */
import { MigrationInterface, QueryRunner } from 'typeorm'

/* */
import { GUEST_KEY, OWNER_KEY } from '@/constant'
import { Role } from '#/core/entity'

export class feedRole1638434439232 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT IGNORE INTO roles (id, name, description) VALUES(UUID(), ?, '')`,
      [OWNER_KEY]
    )

    await queryRunner.query(
      `INSERT IGNORE INTO roles (id, name, description) VALUES(UUID(), ?, '')`,
      [GUEST_KEY]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE IGNORE FROM roles WHERE name = ?`, [
      OWNER_KEY
    ])

    await queryRunner.query(`DELETE IGNORE FROM roles WHERE name = ?`, [
      GUEST_KEY
    ])
  }
}
