import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1727178172389 implements MigrationInterface {
    name = 'Migrate1727178172389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" RENAME COLUMN "userStatus" TO "orderStatus"`);
        await queryRunner.query(`ALTER TYPE "public"."Order_userstatus_enum" RENAME TO "Order_orderstatus_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Order_orderstatus_enum" RENAME TO "Order_userstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "Order" RENAME COLUMN "orderStatus" TO "userStatus"`);
    }

}
