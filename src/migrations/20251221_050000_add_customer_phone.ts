import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
    await payload.db.drizzle.execute(sql`
   DO $$
   BEGIN
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'phone') THEN
       ALTER TABLE "customers" ADD COLUMN "phone" varchar;
     END IF;
   END $$;
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
    await payload.db.drizzle.execute(sql`
   ALTER TABLE "customers" DROP COLUMN IF EXISTS "phone";
  `)
}
