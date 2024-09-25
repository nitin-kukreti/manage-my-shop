import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726230852946 implements MigrationInterface {
  name = 'Migrate1726230852946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_userstatus_enum" AS ENUM('unverified', 'active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "userStatus" "public"."users_userstatus_enum" NOT NULL DEFAULT 'unverified', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_email_index" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_b852abd9e268a63287bc815aab6" UNIQUE ("name"), CONSTRAINT "PK_9309532197a7397548e341e5536" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Shop" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_4588ef7844e6234ce6ceb2c5c52" UNIQUE ("name"), CONSTRAINT "PK_dae0b45de0d0d98634f08788633" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "UserRole" ("id" SERIAL NOT NULL, "shopId" integer, "userId" integer, "roleId" integer, CONSTRAINT "UQ_5835d63ff2d20a9c455d2a75d77" UNIQUE ("userId", "roleId"), CONSTRAINT "PK_83fd6b024a41173978f5b2b9b79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "FK_6505f6b57b25ade66227cb4f36e" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" ADD CONSTRAINT "FK_48ca98fafa3cd9a4c1e8caea1fe" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "FK_48ca98fafa3cd9a4c1e8caea1fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "FK_c09e6f704c7cd9fe2bbc26a1a38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserRole" DROP CONSTRAINT "FK_6505f6b57b25ade66227cb4f36e"`,
    );
    await queryRunner.query(`DROP TABLE "UserRole"`);
    await queryRunner.query(`DROP TABLE "Shop"`);
    await queryRunner.query(`DROP TABLE "Role"`);
    await queryRunner.query(`DROP INDEX "public"."unique_email_index"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_userstatus_enum"`);
  }
}
