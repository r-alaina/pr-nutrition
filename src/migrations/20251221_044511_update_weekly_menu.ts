import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    UPDATE "weekly_menus_rels" R
    SET "path" = CASE 
      WHEN M."category" = 'salad' THEN REPLACE(R."path", 'Meals', 'Salads')
      WHEN M."category" = 'breakfast' THEN 'breakfasts'
      WHEN M."category" = 'snack' THEN 'snacks'
      ELSE REPLACE(R."path", 'Meals', 'Mains')
    END
    FROM "menu_items" M
    WHERE R."menu_items_id" = M."id"
    AND (R."path" = 'firstHalfMeals' OR R."path" = 'secondHalfMeals');
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
    // Migration code
}
