/* */
import { MigrationInterface, QueryRunner } from 'typeorm'

/* */
import { OWNER_KEY } from '@/constant'
import { Permission } from '@/types'
import { Role } from '#/core/entity'

export class feedRolePermission1638436909437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = await queryRunner.connection.getRepository(Role)

    const ownerRole = await roleRepository.findOne({
      where: {
        name: OWNER_KEY
      }
    })

    await queryRunner.query(
      `INSERT IGNORE INTO rolePermissionBindings (id, roleId, permission) VALUES(UUID(), ?, ?)`,
      [ownerRole.id, Permission.MANAGE_ALL]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = await queryRunner.connection.getRepository(Role)

    const ownerRole = await roleRepository.findOne({
      where: {
        name: OWNER_KEY
      }
    })

    await queryRunner.query(
      `DELETE FROM rolePermissionBindings WHERE roleId = ? AND permission = ?`,
      [ownerRole.id, Permission.MANAGE_ALL]
    )
  }
}
