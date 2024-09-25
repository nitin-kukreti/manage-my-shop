import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726487014618 implements MigrationInterface {
  name = 'Migrate1726487014618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "softDelete"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD "softDelete" boolean NOT NULL DEFAULT false`,
    );
  }
}
