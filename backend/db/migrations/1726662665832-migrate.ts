import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1726662665832 implements MigrationInterface {
    name = 'Migrate1726662665832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Inventory" RENAME COLUMN "warehouseLocation" TO "barcodeNumber"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Inventory" RENAME COLUMN "barcodeNumber" TO "warehouseLocation"`);
    }

}
