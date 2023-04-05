import { MigrationInterface, QueryRunner } from "typeorm";

export class userStateEnum1675929749301 implements MigrationInterface {
    name = 'userStateEnum1675929749301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`codes\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`type\` enum ('EMAIL_VEIRIFICATION', 'RESET_PASSWORD', 'USER_INVITATION') NOT NULL, \`key\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`data\` varchar(255) NULL, \`is_verified\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`state\` \`state\` enum ('Active', 'Blocked') NOT NULL DEFAULT 'Active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`state\` \`state\` enum ('0', '1') NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`codes\``);
    }

}
