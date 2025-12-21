import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    CREATE TABLE "challenges_tier_pricing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "price" numeric NOT NULL,
      "tier_id" integer NOT NULL
    );

    -- Foreign Key constraints
    ALTER TABLE "challenges_tier_pricing" ADD CONSTRAINT "challenges_tier_pricing_parent_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;
    
    ALTER TABLE "challenges_tier_pricing" ADD CONSTRAINT "challenges_tier_pricing_tier_id_tiers_id_fk" 
      FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "challenges_tier_pricing_order_idx" ON "challenges_tier_pricing" USING btree ("_order");
    CREATE INDEX "challenges_tier_pricing_parent_id_idx" ON "challenges_tier_pricing" USING btree ("_parent_id");
    CREATE INDEX "challenges_tier_pricing_tier_idx" ON "challenges_tier_pricing" USING btree ("tier_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    DROP TABLE IF EXISTS "challenges_tier_pricing" CASCADE;
  `)
}
