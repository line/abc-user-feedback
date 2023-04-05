import { MigrationInterface, QueryRunner } from "typeorm";

export class IsDisabledDefault01676421265605 implements MigrationInterface {
    name = 'IsDisabledDefault01676421265605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`is_admin\` \`is_admin\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`is_admin\` \`is_admin\` tinyint NOT NULL`);
    }

}
