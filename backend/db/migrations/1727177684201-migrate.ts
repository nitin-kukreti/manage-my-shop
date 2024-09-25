import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1727177684201 implements MigrationInterface {
    name = 'Migrate1727177684201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Order_userstatus_enum" AS ENUM('todo', 'inprogress', 'done')`);
        await queryRunner.query(`ALTER TABLE "Order" ADD "userStatus" "public"."Order_userstatus_enum" NOT NULL DEFAULT 'todo'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "userStatus"`);
        await queryRunner.query(`DROP TYPE "public"."Order_userstatus_enum"`);
    }

}
