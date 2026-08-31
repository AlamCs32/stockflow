import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTables1785700000000 implements MigrationInterface {
  name = 'CreateAuthTables1785700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsersTable = await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')`
    );
    if (hasUsersTable[0]?.exists) {
      await queryRunner.query(
        `ALTER TABLE "items" DROP CONSTRAINT IF EXISTS "FK_3b934e62fb52bac909e0ddf5422"`
      );
      await queryRunner.query(`DROP TABLE "users" CASCADE`);
      await queryRunner.query(`DROP TABLE "items"`);
    }

    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "tenant_id" uuid NOT NULL, "email" text NOT NULL, "password_hash" text NOT NULL, "full_name" text NOT NULL, "phone" text, "is_active" boolean NOT NULL DEFAULT true, "is_email_verified" boolean NOT NULL DEFAULT false, "last_login_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_tenant_email" UNIQUE ("tenant_id", "email"), CONSTRAINT "PK_users" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_tenant_id" ON "users" ("tenant_id")`);

    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "token_hash" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id")`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_token_hash" ON "refresh_tokens" ("token_hash")`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "tenant_id" uuid NOT NULL, "name" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_roles_tenant_name" UNIQUE ("tenant_id", "name"), CONSTRAINT "PK_roles" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_roles_tenant_id" ON "roles" ("tenant_id")`);

    await queryRunner.query(
      `CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_user_roles" PRIMARY KEY ("user_id", "role_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "key" text NOT NULL, "name" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_modules_key" UNIQUE ("key"), CONSTRAINT "PK_modules" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "role_id" uuid NOT NULL, "module_id" uuid NOT NULL, "can_read" boolean NOT NULL DEFAULT false, "can_write" boolean NOT NULL DEFAULT false, "can_update" boolean NOT NULL DEFAULT false, "can_delete" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_role_permissions_role_module" UNIQUE ("role_id", "module_id"), CONSTRAINT "PK_role_permissions" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_role_permissions_module_id" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_module_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_role_id"`
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_role_id"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_user_id"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "modules"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
