import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1726660603034 implements MigrationInterface {
    name = 'Migrate1726660603034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Inventory" ("id" SERIAL NOT NULL, "quantity" numeric(10,2) NOT NULL, "warehouseLocation" character varying, "deletedAt" TIMESTAMP, "productId" integer, CONSTRAINT "PK_35ccf6f4c1826f5b58c759d2e99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_ee31e197600c81513a46cc61636" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`DROP TABLE "Inventory"`);
    }

}
