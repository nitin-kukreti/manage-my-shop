import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726340911578 implements MigrationInterface {
  name = 'Migrate1726340911578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "UQ_5835d63ff2d20a9c455d2a75d77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "UQ_cdd6da568ce460b451629d86047" UNIQUE ("userId", "roleId", "shopId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "UQ_cdd6da568ce460b451629d86047"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "UQ_5835d63ff2d20a9c455d2a75d77" UNIQUE ("userId", "roleId")`,
    );
  }
}
