import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_customers_days_per_week" AS ENUM('5', '7');
  CREATE TYPE "public"."enum_customers_meals_per_day" AS ENUM('1', '2');
  ALTER TABLE "customers" ADD COLUMN "days_per_week" "enum_customers_days_per_week";
  ALTER TABLE "customers" ADD COLUMN "meals_per_day" "enum_customers_meals_per_day";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "customers" DROP COLUMN "days_per_week";
  ALTER TABLE "customers" DROP COLUMN "meals_per_day";
  DROP TYPE "public"."enum_customers_days_per_week";
  DROP TYPE "public"."enum_customers_meals_per_day";`)
}
