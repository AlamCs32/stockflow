import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupplierFields1788612425234 implements MigrationInterface {
    name = 'AddSupplierFields1788612425234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_role_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_module_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_user_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_role_id"`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" DROP CONSTRAINT "FK_channel_pricings_variant_id"`);
        await queryRunner.query(`ALTER TABLE "stock_logs" DROP CONSTRAINT "FK_stock_logs_variant_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_product_variants_design_id"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_designs_supplier_id"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_designs_category_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_token_hash"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_channel_pricings_variant_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_stock_logs_variant_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_product_variants_design_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_designs_supplier_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_designs_category_id"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "UQ_role_permissions_role_module"`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" DROP CONSTRAINT "UQ_channel_pricings_variant_channel"`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "mobile_no" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "category" text NOT NULL DEFAULT 'GENERAL'`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "trust_score" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "quality_score" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "availability_status" text NOT NULL DEFAULT 'ALWAYS_AVAILABLE'`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "lead_time_days" integer`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "city" text`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "state" text`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "gst_number" text`);
        await queryRunner.query(`ALTER TABLE "suppliers" ADD "pan_number" text`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_2e0c5c1b40a4137a80930b3b65e" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" ADD CONSTRAINT "FK_96b6d30eae4de470301bf045880" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_logs" ADD CONSTRAINT "FK_1a6e0ffeca41d4870227efce53a" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_9ac331ea6e0cc8aceb1a1dc1d2d" FOREIGN KEY ("design_id") REFERENCES "designs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "designs" ADD CONSTRAINT "FK_24af36f8608312c01982d0f27f9" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "designs" ADD CONSTRAINT "FK_bcc5edecc4aa719d38892cb54c4" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_bcc5edecc4aa719d38892cb54c4"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT "FK_24af36f8608312c01982d0f27f9"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_9ac331ea6e0cc8aceb1a1dc1d2d"`);
        await queryRunner.query(`ALTER TABLE "stock_logs" DROP CONSTRAINT "FK_1a6e0ffeca41d4870227efce53a"`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" DROP CONSTRAINT "FK_96b6d30eae4de470301bf045880"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_2e0c5c1b40a4137a80930b3b65e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "pan_number"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "gst_number"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "lead_time_days"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "availability_status"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "quality_score"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "trust_score"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "suppliers" DROP COLUMN "mobile_no"`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" ADD CONSTRAINT "UQ_channel_pricings_variant_channel" UNIQUE ("channel_name", "variant_id")`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "UQ_role_permissions_role_module" UNIQUE ("module_id", "role_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_designs_category_id" ON "designs" USING btree ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_designs_supplier_id" ON "designs" USING btree ("supplier_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_product_variants_design_id" ON "product_variants" USING btree ("design_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_stock_logs_variant_id" ON "stock_logs" USING btree ("variant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_channel_pricings_variant_id" ON "channel_pricings" USING btree ("variant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" USING btree ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_token_hash" ON "refresh_tokens" USING btree ("token_hash") `);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" USING btree ("user_id") `);
        await queryRunner.query(`ALTER TABLE "designs" ADD CONSTRAINT "FK_designs_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "designs" ADD CONSTRAINT "FK_designs_supplier_id" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_product_variants_design_id" FOREIGN KEY ("design_id") REFERENCES "designs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_logs" ADD CONSTRAINT "FK_stock_logs_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_pricings" ADD CONSTRAINT "FK_channel_pricings_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_module_id" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
