import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726831557064 implements MigrationInterface {
  name = 'Migrate1726831557064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Order" ("id" SERIAL NOT NULL, "phone_no" character varying NOT NULL, "shopId" integer, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrderItem" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_6bdc02af31674c4216a6b0a8b39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Order" ADD CONSTRAINT "FK_2046634305c4cf2dd700f42ada1" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_c94ace27164b9ffde93ebdbe95c" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_c94ace27164b9ffde93ebdbe95c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Order" DROP CONSTRAINT "FK_2046634305c4cf2dd700f42ada1"`,
    );
    await queryRunner.query(`DROP TABLE "OrderItem"`);
    await queryRunner.query(`DROP TABLE "Order"`);
  }
}
