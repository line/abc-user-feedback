/* */
import { MigrationInterface, QueryRunner } from 'typeorm'

/* */
import { Role } from '#/core/entity'
import { Permission } from '@/types'
import { OWNER_KEY } from '@/constant'

export class createRolePermissionBidning1638123392733
  implements MigrationInterface
{
  name = 'createRolePermissionBidning1638123392733'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`rolePermissionBindings\` (\`id\` char(36) NOT NULL, \`roleId\` char(36) NOT NULL, \`permission\` enum ('manage.all', 'read.users', 'create.user', 'delete.user', 'invite.user', 'read.feedbacks', 'create.feedback', 'update.service', 'update.invitation', 'read.roles', 'delete.role', 'manage.role') NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )

    const roleRepository = await queryRunner.connection.getRepository(Role)

    const owner = await roleRepository.findOne({
      where: {
        name: OWNER_KEY
      }
    })

    await queryRunner.query(
      `INSERT INTO rolePermissionBindings (id, roleId, permission) VALUES(UUID(), ?, ?)`,
      [owner.id, Permission.MANAGE_ALL]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`rolePermissionBindings\``)
  }
}
