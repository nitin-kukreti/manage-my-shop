import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1727174679123 implements MigrationInterface {
    name = 'Migrate1727174679123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" ADD "availableQuantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "availableQuantity"`);
    }

}
