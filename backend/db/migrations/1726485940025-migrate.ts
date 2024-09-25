import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726485940025 implements MigrationInterface {
  name = 'Migrate1726485940025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'softDelete' column to UserRole
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD "softDelete" boolean NOT NULL DEFAULT false`,
    );

    // Drop the old index on 'email' column
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."unique_email_index"`,
    );

    // Alter the column type from varchar to text, without dropping it
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" TYPE text`,
    );

    // Recreate the unique index on the 'email' column
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_email_index" ON "users" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index on 'email' column
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."unique_email_index"`,
    );

    // Revert the column type back to varchar(255)
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(255)`,
    );

    // Recreate the unique index on 'email' column
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_email_index" ON "users" ("email")`,
    );

    // Remove the 'softDelete' column from UserRole
    await queryRunner.query(`ALTER TABLE "UserRole" DROP COLUMN "softDelete"`);
  }
}
