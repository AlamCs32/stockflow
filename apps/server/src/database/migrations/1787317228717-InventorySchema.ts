import { MigrationInterface, QueryRunner } from 'typeorm';

export class InventorySchema1787317228717 implements MigrationInterface {
  name = 'InventorySchema1787317228717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vendors" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "contact_email" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "code" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_df599df4d0b16b4dabc24f4a0ec" UNIQUE ("code"), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_categories"("id", "name", "code", "createdAt") SELECT "id", "name", upper(substr(replace("name", ' ', ''), 1, 3)) || '_' || "id", "createdAt" FROM "categories"`
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
    await queryRunner.query(
      `CREATE TABLE "designs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "design_code" text NOT NULL, "pattern_code" text NOT NULL, "name" text NOT NULL, "vendor_id" text NOT NULL, "category_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_designs_design_code" UNIQUE ("design_code"), CONSTRAINT "FK_designs_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_designs_category_id" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_designs_vendor_id" ON "designs" ("vendor_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_designs_category_id" ON "designs" ("category_id")`
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "sku" text NOT NULL, "color_name" text NOT NULL, "color_code" text NOT NULL, "size" text NOT NULL, "cost_price" real NOT NULL, "stock_quantity" integer NOT NULL DEFAULT (0), "sample_photo_url" text, "status" text NOT NULL DEFAULT ('ACTIVE'), "design_id" integer NOT NULL, CONSTRAINT "UQ_product_variants_sku" UNIQUE ("sku"), CONSTRAINT "FK_product_variants_design_id" FOREIGN KEY ("design_id") REFERENCES "designs" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_variants_design_id" ON "product_variants" ("design_id")`
    );
    await queryRunner.query(
      `CREATE TABLE "channel_pricings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "channel_name" text NOT NULL, "selling_price" real NOT NULL, "margin" real NOT NULL, "variant_id" integer NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_channel_pricings_variant_channel" UNIQUE ("variant_id", "channel_name"), CONSTRAINT "FK_channel_pricings_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_channel_pricings_variant_id" ON "channel_pricings" ("variant_id")`
    );
    await queryRunner.query(
      `CREATE TABLE "stock_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "variant_id" integer NOT NULL, "quantity_change" integer NOT NULL, "reason" text NOT NULL, "channel" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_stock_logs_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(`CREATE INDEX "IDX_stock_logs_variant_id" ON "stock_logs" ("variant_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stock_logs"`);
    await queryRunner.query(`DROP TABLE "channel_pricings"`);
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(`DROP TABLE "designs"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_categories"("id", "name", "createdAt") SELECT "id", "name", "createdAt" FROM "categories"`
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`ALTER TABLE "temporary_categories" RENAME TO "categories"`);
    await queryRunner.query(`DROP TABLE "vendors"`);
  }
}
