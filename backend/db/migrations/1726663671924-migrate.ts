import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1726663671924 implements MigrationInterface {
    name = 'Migrate1726663671924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Inventory" DROP COLUMN "barcodeNumber"`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "UQ_ee31e197600c81513a46cc61636" UNIQUE ("productId")`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_ee31e197600c81513a46cc61636" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "UQ_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_ee31e197600c81513a46cc61636" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD "barcodeNumber" character varying`);
    }

}
