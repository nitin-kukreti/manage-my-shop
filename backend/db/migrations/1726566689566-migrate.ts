import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrate1726566689566 implements MigrationInterface {
  name = 'Migrate1726566689566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "category" character varying, "deletedAt" TIMESTAMP, "shopId" integer, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_40fcaeed4aa63549eeb179e82cf" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_40fcaeed4aa63549eeb179e82cf"`,
    );
    await queryRunner.query(`DROP TABLE "Product"`);
  }
}
