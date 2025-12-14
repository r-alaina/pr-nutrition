import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tiers" DROP COLUMN "monthly_price";
  ALTER TABLE "tiers" DROP COLUMN "weekly_price";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tiers" ADD COLUMN "monthly_price" numeric NOT NULL;
  ALTER TABLE "tiers" ADD COLUMN "weekly_price" numeric NOT NULL;`)
}
