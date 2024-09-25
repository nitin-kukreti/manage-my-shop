import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726487882189 implements MigrationInterface {
  name = 'Migrate1726487882189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Role" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "Shop" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "UserRole" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "Shop" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "Role" DROP COLUMN "deletedAt"`);
  }
}
