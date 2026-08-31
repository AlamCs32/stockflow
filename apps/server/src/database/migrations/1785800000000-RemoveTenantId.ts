import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTenantId1785800000000 implements MigrationInterface {
  name = 'RemoveTenantId1785800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_users_tenant_email"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_tenant_id"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "UQ_roles_tenant_name"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "tenant_id"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_roles_name" UNIQUE ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "UQ_roles_name"`);
    await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "tenant_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_roles_tenant_name" UNIQUE ("tenant_id", "name")`
    );
    await queryRunner.query(`CREATE INDEX "IDX_roles_tenant_id" ON "roles" ("tenant_id")`);

    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_users_email"`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "tenant_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_tenant_email" UNIQUE ("tenant_id", "email")`
    );
    await queryRunner.query(`CREATE INDEX "IDX_users_tenant_id" ON "users" ("tenant_id")`);
  }
}
