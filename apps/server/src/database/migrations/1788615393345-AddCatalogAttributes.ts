import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCatalogAttributes1788615393345 implements MigrationInterface {
    name = 'AddCatalogAttributes1788615393345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "designs" ADD "category_attributes" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "attributes_schema" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "attributes_schema"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "category_attributes"`);
    }

}
