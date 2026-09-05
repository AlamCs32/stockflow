import { MigrationInterface, QueryRunner } from "typeorm";

export class ForceAddCategoryAttributes1788615393346 implements MigrationInterface {
    name = 'ForceAddCategoryAttributes1788615393346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasCatAttr = await queryRunner.query(
            `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'designs' AND column_name = 'category_attributes')`
        );
        if (!hasCatAttr[0].exists) {
            await queryRunner.query(`ALTER TABLE "designs" ADD "category_attributes" jsonb NOT NULL DEFAULT '{}'`);
        }

        const hasAttrSchema = await queryRunner.query(
            `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'attributes_schema')`
        );
        if (!hasAttrSchema[0].exists) {
            await queryRunner.query(`ALTER TABLE "categories" ADD "attributes_schema" jsonb NOT NULL DEFAULT '[]'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN IF EXISTS "category_attributes"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN IF EXISTS "attributes_schema"`);
    }
}
