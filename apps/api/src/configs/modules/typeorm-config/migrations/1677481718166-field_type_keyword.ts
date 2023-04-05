import { MigrationInterface, QueryRunner } from "typeorm";

export class fieldTypeKeyword1677481718166 implements MigrationInterface {
    name = 'fieldTypeKeyword1677481718166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`type\` \`type\` enum ('text', 'keyword', 'number', 'boolean', 'select', 'date') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fields\` CHANGE \`type\` \`type\` enum ('text', 'number', 'boolean', 'select', 'date') NOT NULL`);
    }

}
