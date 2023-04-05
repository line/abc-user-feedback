import { MigrationInterface, QueryRunner } from "typeorm";

export class deleteSiteLogoUrl1679561922776 implements MigrationInterface {
    name = 'deleteSiteLogoUrl1679561922776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tenant\` DROP COLUMN \`site_logo_url\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tenant\` ADD \`site_logo_url\` varchar(255) NOT NULL`);
    }

}
