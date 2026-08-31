import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1785583091128 implements MigrationInterface {
  name = 'InitialSchema1785583091128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "user_id" integer, "category_id" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0c4aa809ddf5b0c6ca45d8a8e80" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
