import { MigrationInterface, QueryRunner } from "typeorm";

export class fieldIsDisabled1677026278182 implements MigrationInterface {
    name = 'fieldIsDisabled1677026278182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`is_disabled\` \`is_disabled\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`is_disabled\` \`is_disabled\` tinyint NOT NULL`);
    }

}
