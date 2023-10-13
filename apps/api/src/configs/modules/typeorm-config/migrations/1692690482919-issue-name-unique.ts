import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssueNameUnique1692690482919 implements MigrationInterface {
  name = 'IssueNameUnique1692690482919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` ON \`issues\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`issue-name-unique\` ON \`issues\` (\`name\`, \`project_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`issue-name-unique\` ON \`issues\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_b711d3eb6f21e35f5a0623dbe2\` ON \`issues\` (\`name\`)`,
    );
  }
}
