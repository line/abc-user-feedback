import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTables1638434314999 implements MigrationInterface {
  name = 'createTables1638434314999'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`comments\` (\`id\` char(36) NOT NULL, \`body\` text NOT NULL, \`userId\` char(36) NOT NULL, \`postId\` char(36) NOT NULL, \`voteCount\` int NOT NULL DEFAULT '0', \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`posts\` (\`id\` char(36) NOT NULL, \`number\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`userId\` char(36) NOT NULL, \`voteCount\` int NOT NULL DEFAULT '0', \`commentCount\` int NOT NULL DEFAULT '0', \`isPrivate\` tinyint NOT NULL DEFAULT 0, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`postVotes\` (\`id\` char(36) NOT NULL, \`postId\` char(36) NOT NULL, \`userId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`users\` (\`id\` char(36) NOT NULL, \`email\` varchar(255) NULL, \`state\` enum ('0', '1', '2') NOT NULL DEFAULT '0', \`hashPassword\` varchar(255) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`userProfiles\` (\`id\` char(36) NOT NULL, \`nickname\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`userId\` char(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_8463995d3381a8c407f66c4727\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`service\` (\`version\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`entryPath\` varchar(255) NOT NULL, \`logoUrl\` varchar(255) NOT NULL, \`locale\` enum ('en', 'ja', 'ko') NOT NULL, \`isPrivate\` tinyint NOT NULL DEFAULT 0, \`isRestrictDomain\` tinyint NOT NULL DEFAULT 0, \`allowDomains\` text NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`version\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`email_auths\` (\`id\` char(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`userId\` char(36) NULL, \`type\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0', \`asRole\` varchar(255) NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`feedbacks\` (\`id\` char(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`allowAnonymous\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(255) NOT NULL, \`userId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`custom_auths\` (\`id\` varchar(255) NOT NULL, \`userId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`feedbackResponses\` (\`id\` char(36) NOT NULL, \`userId\` char(36) NULL, \`feedbackId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_b6d6a5e0c0d06c3c70c31424ee\` (\`feedbackId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`feedbackResponseFields\` (\`id\` char(36) NOT NULL, \`feedbackFieldId\` char(36) NOT NULL, \`feedbackResponseId\` char(36) NOT NULL, \`value\` varchar(10000) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`feedbackFields\` (\`id\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`type\` enum ('text', 'textarea', 'select', 'number', 'boolean', 'datetime') NOT NULL, \`isRequired\` tinyint NOT NULL DEFAULT 0, \`order\` int NOT NULL, \`feedbackId\` char(36) NOT NULL, \`option\` text NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_832e1e7b224a02653d8ee96937\` (\`feedbackId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`roles\` (\`id\` char(36) NOT NULL, \`name\` varchar(20) NOT NULL, \`description\` varchar(255) NULL DEFAULT '', \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`rolePermissionBindings\` (\`id\` char(36) NOT NULL, \`roleId\` char(36) NOT NULL, \`permission\` enum ('manage.all', 'read.users', 'delete.user', 'invite.user', 'read.feedbacks', 'read.feedback', 'create.feedback', 'update.feedback', 'delete.feedback', 'export.response', 'delete.response', 'manage.service', 'update.invitation', 'read.roles', 'manage.role') NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`roleUserBindings\` (\`id\` char(36) NOT NULL, \`userId\` char(36) NOT NULL, \`roleId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`accounts\` (\`id\` char(36) NOT NULL, \`provider\` varchar(255) NOT NULL, \`providerKey\` varchar(255) NOT NULL, \`userId\` char(36) NOT NULL, \`createdTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )

    try {
      await queryRunner.query(
        `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`postVotes\` ADD CONSTRAINT \`FK_2b34cc0ffde7259b6365b7d93e3\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`postVotes\` ADD CONSTRAINT \`FK_c47ab0589763c9ab33c75605964\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`userProfiles\` ADD CONSTRAINT \`FK_8463995d3381a8c407f66c4727d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbacks\` ADD CONSTRAINT \`FK_e9b6450d76be18b05b5f09d577b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`custom_auths\` ADD CONSTRAINT \`FK_0cd0fbb62623bc2c178266e5ea5\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbackResponses\` ADD CONSTRAINT \`FK_daff7a7c1ee6227d17f4ec5695f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbackResponses\` ADD CONSTRAINT \`FK_b6d6a5e0c0d06c3c70c31424eee\` FOREIGN KEY (\`feedbackId\`) REFERENCES \`feedbacks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbackResponseFields\` ADD CONSTRAINT \`FK_649ee4265f34166cc7d9d31b803\` FOREIGN KEY (\`feedbackFieldId\`) REFERENCES \`feedbackFields\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbackResponseFields\` ADD CONSTRAINT \`FK_d386d52f23577587fe06cf3227f\` FOREIGN KEY (\`feedbackResponseId\`) REFERENCES \`feedbackResponses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`feedbackFields\` ADD CONSTRAINT \`FK_832e1e7b224a02653d8ee969375\` FOREIGN KEY (\`feedbackId\`) REFERENCES \`feedbacks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`roleUserBindings\` ADD CONSTRAINT \`FK_d00ed05b5f56354dc2a2b768c61\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`roleUserBindings\` ADD CONSTRAINT \`FK_df92df44a332504ec4be23b3118\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
      await queryRunner.query(
        `ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_3aa23c0a6d107393e8b40e3e2a6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
      )
    } catch (err) {
      console.error(err)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_3aa23c0a6d107393e8b40e3e2a6\``
    )
    await queryRunner.query(
      `ALTER TABLE \`roleUserBindings\` DROP FOREIGN KEY \`FK_df92df44a332504ec4be23b3118\``
    )
    await queryRunner.query(
      `ALTER TABLE \`roleUserBindings\` DROP FOREIGN KEY \`FK_d00ed05b5f56354dc2a2b768c61\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackFields\` DROP FOREIGN KEY \`FK_832e1e7b224a02653d8ee969375\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP FOREIGN KEY \`FK_d386d52f23577587fe06cf3227f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponseFields\` DROP FOREIGN KEY \`FK_649ee4265f34166cc7d9d31b803\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` DROP FOREIGN KEY \`FK_b6d6a5e0c0d06c3c70c31424eee\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbackResponses\` DROP FOREIGN KEY \`FK_daff7a7c1ee6227d17f4ec5695f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`custom_auths\` DROP FOREIGN KEY \`FK_0cd0fbb62623bc2c178266e5ea5\``
    )
    await queryRunner.query(
      `ALTER TABLE \`feedbacks\` DROP FOREIGN KEY \`FK_e9b6450d76be18b05b5f09d577b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`userProfiles\` DROP FOREIGN KEY \`FK_8463995d3381a8c407f66c4727d\``
    )
    await queryRunner.query(
      `ALTER TABLE \`postVotes\` DROP FOREIGN KEY \`FK_c47ab0589763c9ab33c75605964\``
    )
    await queryRunner.query(
      `ALTER TABLE \`postVotes\` DROP FOREIGN KEY \`FK_2b34cc0ffde7259b6365b7d93e3\``
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``
    )
    await queryRunner.query(
      `DROP INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` ON \`accounts\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`accounts\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`roleUserBindings\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`rolePermissionBindings\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`roles\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_832e1e7b224a02653d8ee96937\` ON \`feedbackFields\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedbackFields\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedbackResponseFields\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_b6d6a5e0c0d06c3c70c31424ee\` ON \`feedbackResponses\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedbackResponses\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`custom_auths\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`feedbacks\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`email_auths\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`service\``)
    await queryRunner.query(
      `DROP INDEX \`REL_8463995d3381a8c407f66c4727\` ON \`userProfiles\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`userProfiles\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``
    )
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`postVotes\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`posts\``)
    await queryRunner.query(`DROP TABLE IF EXISTS \`comments\``)
  }
}
