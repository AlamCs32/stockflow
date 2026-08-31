import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1785583091128 implements MigrationInterface {
  name = 'InitialSchema1785583091128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416599b338663e49d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" text NOT NULL, "code" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_df599df4d0b16b4dabc24f4a0ec" UNIQUE ("code"), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_af985a02284455c518649d1f6e0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "name" text NOT NULL, "user_id" integer, "category_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e6012580f3db8c7e2b60e5dfd0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TABLE "vendors" ("id" text NOT NULL, "name" text NOT NULL, "contact_email" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eeabcf40834b40e48f1a870e549" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "designs" ("id" SERIAL NOT NULL, "design_code" text NOT NULL, "pattern_code" text NOT NULL, "name" text NOT NULL, "vendor_id" text NOT NULL, "category_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_designs_design_code" UNIQUE ("design_code"), CONSTRAINT "PK_9ea6bc450486c4ef2de87e91593" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_designs_vendor_id" ON "designs" ("vendor_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_designs_category_id" ON "designs" ("category_id")`);
    await queryRunner.query(
      `ALTER TABLE "designs" ADD CONSTRAINT "FK_designs_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD CONSTRAINT "FK_designs_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "sku" text NOT NULL, "color_name" text NOT NULL, "color_code" text NOT NULL, "size" text NOT NULL, "cost_price" double precision NOT NULL, "stock_quantity" integer NOT NULL DEFAULT 0, "sample_photo_url" text, "status" text NOT NULL DEFAULT 'ACTIVE', "design_id" integer NOT NULL, CONSTRAINT "UQ_product_variants_sku" UNIQUE ("sku"), CONSTRAINT "PK_3517aad07885f735f0f9d94204c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_variants_design_id" ON "product_variants" ("design_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_product_variants_design_id" FOREIGN KEY ("design_id") REFERENCES "designs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TABLE "channel_pricings" ("id" SERIAL NOT NULL, "channel_name" text NOT NULL, "selling_price" double precision NOT NULL, "margin" double precision NOT NULL, "variant_id" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_channel_pricings_variant_channel" UNIQUE ("variant_id", "channel_name"), CONSTRAINT "PK_f0f432564f47c2a09e4c2e0e6a2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_channel_pricings_variant_id" ON "channel_pricings" ("variant_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_pricings" ADD CONSTRAINT "FK_channel_pricings_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_logs" ("id" SERIAL NOT NULL, "variant_id" integer NOT NULL, "quantity_change" integer NOT NULL, "reason" text NOT NULL, "channel" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4e4e5e5e5e5e5e5e5e5e5e5e5e5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_stock_logs_variant_id" ON "stock_logs" ("variant_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "stock_logs" ADD CONSTRAINT "FK_stock_logs_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stock_logs" DROP CONSTRAINT "FK_stock_logs_variant_id"`);
    await queryRunner.query(
      `ALTER TABLE "channel_pricings" DROP CONSTRAINT "FK_channel_pricings_variant_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_product_variants_design_id"`
    );
    await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_designs_category_id"`);
    await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_designs_vendor_id"`);
    await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80"`);
    await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422"`);
    await queryRunner.query(`DROP TABLE "stock_logs"`);
    await queryRunner.query(`DROP TABLE "channel_pricings"`);
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(`DROP TABLE "designs"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "vendors"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
