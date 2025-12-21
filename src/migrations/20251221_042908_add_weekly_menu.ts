import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_weekly_menus_status" AS ENUM('draft', 'active', 'archived');
/*
  CREATE TABLE "order_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"change_description" varchar NOT NULL,
  	"previous_items" jsonb,
  	"new_items" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
*/
  
  CREATE TABLE "weekly_menus_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_items_id" integer
  );
  
  ALTER TABLE "weekly_menus_first_half_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "weekly_menus_second_half_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "weekly_menus_first_half_items" CASCADE;
  DROP TABLE "weekly_menus_second_half_items" CASCADE;
  ALTER TABLE "menu_items" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_menu_items_category";
  CREATE TYPE "public"."enum_menu_items_category" AS ENUM('main', 'premium', 'breakfast', 'dessert', 'salad', 'snack');`)

  // Data migration for old values
  await db.execute(sql`UPDATE "menu_items" SET "category" = 'main' WHERE "category" IN ('lunch', 'dinner');`)
  await db.execute(sql`UPDATE "menu_items" SET "category" = 'breakfast' WHERE "category" IN ('breakfast-small', 'breakfast-large');`)

  await db.execute(sql`
  ALTER TABLE "menu_items" ALTER COLUMN "category" SET DATA TYPE "public"."enum_menu_items_category" USING "category"::"public"."enum_menu_items_category";
  -- ALTER TABLE "customers" ADD COLUMN "plan_credits" numeric DEFAULT 0;
  ALTER TABLE "weekly_menus" ADD COLUMN "week_of" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "weekly_menus" ADD COLUMN "status" "enum_weekly_menus_status" DEFAULT 'draft' NOT NULL;
  -- ALTER TABLE "orders" ADD COLUMN "week_of" timestamp(3) with time zone;
  -- ALTER TABLE "orders" ADD COLUMN "is_credit_used" boolean DEFAULT false;
  -- ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "order_logs_id" integer;
  -- ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  -- ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "weekly_menus_rels" ADD CONSTRAINT "weekly_menus_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "weekly_menus_rels" ADD CONSTRAINT "weekly_menus_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  -- CREATE INDEX "order_logs_order_idx" ON "order_logs" USING btree ("order_id");
  -- CREATE INDEX "order_logs_customer_idx" ON "order_logs" USING btree ("customer_id");
  -- CREATE INDEX "order_logs_updated_at_idx" ON "order_logs" USING btree ("updated_at");
  -- CREATE INDEX "order_logs_created_at_idx" ON "order_logs" USING btree ("created_at");
  CREATE INDEX "weekly_menus_rels_order_idx" ON "weekly_menus_rels" USING btree ("order");
  CREATE INDEX "weekly_menus_rels_parent_idx" ON "weekly_menus_rels" USING btree ("parent_id");
  CREATE INDEX "weekly_menus_rels_path_idx" ON "weekly_menus_rels" USING btree ("path");
  CREATE INDEX "weekly_menus_rels_menu_items_id_idx" ON "weekly_menus_rels" USING btree ("menu_items_id");
  -- ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_logs_fk" FOREIGN KEY ("order_logs_id") REFERENCES "public"."order_logs"("id") ON DELETE cascade ON UPDATE no action;
  -- CREATE INDEX "payload_locked_documents_rels_order_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("order_logs_id");
  ALTER TABLE "weekly_menus" DROP COLUMN "week_label";
  ALTER TABLE "weekly_menus" DROP COLUMN "start_date";
  ALTER TABLE "weekly_menus" DROP COLUMN "end_date";
  ALTER TABLE "weekly_menus" DROP COLUMN "active";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "weekly_menus_first_half_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"menu_item_id" integer NOT NULL,
  	"available" boolean DEFAULT true
  );
  
  CREATE TABLE "weekly_menus_second_half_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"menu_item_id" integer NOT NULL,
  	"available" boolean DEFAULT true
  );
  
  ALTER TABLE "order_logs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "weekly_menus_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "order_logs" CASCADE;
  DROP TABLE "weekly_menus_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_order_logs_fk";
  
  ALTER TABLE "menu_items" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_menu_items_category";
  CREATE TYPE "public"."enum_menu_items_category" AS ENUM('lunch', 'dinner', 'premium', 'breakfast-small', 'breakfast-large', 'dessert', 'salad', 'snack');
  ALTER TABLE "menu_items" ALTER COLUMN "category" SET DATA TYPE "public"."enum_menu_items_category" USING "category"::"public"."enum_menu_items_category";
  DROP INDEX "payload_locked_documents_rels_order_logs_id_idx";
  ALTER TABLE "weekly_menus" ADD COLUMN "week_label" varchar NOT NULL;
  ALTER TABLE "weekly_menus" ADD COLUMN "start_date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "weekly_menus" ADD COLUMN "end_date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "weekly_menus" ADD COLUMN "active" boolean DEFAULT true;
  ALTER TABLE "weekly_menus_first_half_items" ADD CONSTRAINT "weekly_menus_first_half_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "weekly_menus_first_half_items" ADD CONSTRAINT "weekly_menus_first_half_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "weekly_menus_second_half_items" ADD CONSTRAINT "weekly_menus_second_half_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "weekly_menus_second_half_items" ADD CONSTRAINT "weekly_menus_second_half_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "weekly_menus_first_half_items_order_idx" ON "weekly_menus_first_half_items" USING btree ("_order");
  CREATE INDEX "weekly_menus_first_half_items_parent_id_idx" ON "weekly_menus_first_half_items" USING btree ("_parent_id");
  CREATE INDEX "weekly_menus_first_half_items_menu_item_idx" ON "weekly_menus_first_half_items" USING btree ("menu_item_id");
  CREATE INDEX "weekly_menus_second_half_items_order_idx" ON "weekly_menus_second_half_items" USING btree ("_order");
  CREATE INDEX "weekly_menus_second_half_items_parent_id_idx" ON "weekly_menus_second_half_items" USING btree ("_parent_id");
  CREATE INDEX "weekly_menus_second_half_items_menu_item_idx" ON "weekly_menus_second_half_items" USING btree ("menu_item_id");
  ALTER TABLE "customers" DROP COLUMN "plan_credits";
  ALTER TABLE "orders" DROP COLUMN "week_of";
  ALTER TABLE "orders" DROP COLUMN "is_credit_used";
  ALTER TABLE "weekly_menus" DROP COLUMN "week_of";
  ALTER TABLE "weekly_menus" DROP COLUMN "status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "order_logs_id";
  DROP TYPE "public"."enum_weekly_menus_status";`)
}
