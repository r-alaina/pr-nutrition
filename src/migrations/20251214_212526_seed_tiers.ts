import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "tiers" ("tier_name", "description", "monthly_price", "weekly_price", "single_price", "updated_at", "created_at") VALUES
    ('Tier 1', '1200 Cal', 288.80, 76.50, 8.50, NOW(), NOW()),
    ('Tier 1+', '1300-1400 Cal', 306.00, 81.00, 9.00, NOW(), NOW()),
    ('Tier 2', '1500 Cal', 322.80, 85.50, 9.50, NOW(), NOW()),
    ('Tier 2+', '1600-1700 Cal', 340.00, 90.00, 10.00, NOW(), NOW()),
    ('Tier 3', '1800-2000 Cal', 356.80, 94.50, 10.50, NOW(), NOW()),
    ('Tier 3+', '2100-2200 Cal', 374.00, 99.00, 11.00, NOW(), NOW());
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "tiers" WHERE "tier_name" IN ('Tier 1', 'Tier 1+', 'Tier 2', 'Tier 2+', 'Tier 3', 'Tier 3+');
  `)
}
