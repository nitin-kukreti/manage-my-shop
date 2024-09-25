import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1727163529204 implements MigrationInterface {
    name = 'Migrate1727163529204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ware_house" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "shopId" integer, CONSTRAINT "UQ_7b54a7e4e586f0189fb7d4ef4ad" UNIQUE ("name"), CONSTRAINT "PK_2cd58c197b5c9f327b43a38b838" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD "wareHouseId" integer`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "UQ_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_ee31e197600c81513a46cc61636" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_9e29aae2d7ca0081e8cb36b0a2c" FOREIGN KEY ("wareHouseId") REFERENCES "ware_house"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ware_house" ADD CONSTRAINT "FK_fb332598aa3323ea22dd31aa439" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ware_house" DROP CONSTRAINT "FK_fb332598aa3323ea22dd31aa439"`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_9e29aae2d7ca0081e8cb36b0a2c"`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP CONSTRAINT "FK_ee31e197600c81513a46cc61636"`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "UQ_ee31e197600c81513a46cc61636" UNIQUE ("productId")`);
        await queryRunner.query(`ALTER TABLE "Inventory" ADD CONSTRAINT "FK_ee31e197600c81513a46cc61636" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Inventory" DROP COLUMN "wareHouseId"`);
        await queryRunner.query(`DROP TABLE "ware_house"`);
    }

}
