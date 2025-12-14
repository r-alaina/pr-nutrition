import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'user');
  CREATE TYPE "public"."enum_customers_week_half" AS ENUM('firstHalf', 'secondHalf');
  CREATE TYPE "public"."enum_menu_items_category" AS ENUM('lunch', 'dinner', 'premium', 'breakfast-small', 'breakfast-large', 'dessert', 'salad', 'snack');
  CREATE TYPE "public"."enum_orders_order_items_week_half" AS ENUM('firstHalf', 'secondHalf');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_orders_subscription_frequency" AS ENUM('weekly', 'monthly', 'a_la_carte');
  CREATE TYPE "public"."enum_orders_week_half" AS ENUM('firstHalf', 'secondHalf', 'both');
  CREATE TYPE "public"."enum_kitchen_orders_week_half" AS ENUM('firstHalf', 'secondHalf', 'both');
  CREATE TYPE "public"."enum_kitchen_orders_status" AS ENUM('pending', 'preparing', 'ready', 'completed');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"tier_id" integer,
  	"credit_balance" numeric,
  	"credit_bal_exp" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"preferences_set" boolean DEFAULT false,
  	"subscription_frequency" varchar,
  	"meals_per_week" numeric,
  	"include_breakfast" boolean DEFAULT false,
  	"include_snacks" boolean DEFAULT false,
  	"week_half" "enum_customers_week_half",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "customers_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "menu_items_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar
  );
  
  CREATE TABLE "menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"price" numeric,
  	"category" "enum_menu_items_category" NOT NULL,
  	"active" boolean DEFAULT true,
  	"availability_first_half" boolean DEFAULT false,
  	"availability_second_half" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tier_name" varchar NOT NULL,
  	"description" varchar,
  	"monthly_price" numeric NOT NULL,
  	"weekly_price" numeric NOT NULL,
  	"single_price" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "weekly_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"week_label" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_order_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"menu_item_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"week_half" "enum_orders_order_items_week_half",
  	"unit_price" numeric,
  	"total_price" numeric
  );
  
  CREATE TABLE "orders_allergen_charges_matching_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar NOT NULL,
  	"charge" numeric NOT NULL
  );
  
  CREATE TABLE "orders_allergen_charges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meal_id" varchar NOT NULL,
  	"meal_name" varchar NOT NULL,
  	"quantity" numeric NOT NULL,
  	"total_allergen_charge" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"tax_amount" numeric NOT NULL,
  	"total_amount" numeric NOT NULL,
  	"tier_id" integer,
  	"subscription_frequency" "enum_orders_subscription_frequency",
  	"meals_per_week" numeric,
  	"week_half" "enum_orders_week_half",
  	"notes" varchar,
  	"total_allergen_charges" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "kitchen_orders_order_items_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar
  );
  
  CREATE TABLE "kitchen_orders_order_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meal_name" varchar NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "kitchen_orders_allergen_charges_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar NOT NULL
  );
  
  CREATE TABLE "kitchen_orders_allergen_charges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meal_name" varchar NOT NULL,
  	"charge" numeric NOT NULL
  );
  
  CREATE TABLE "kitchen_orders_tier_aggregation_meals" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meal_name" varchar NOT NULL,
  	"quantity" numeric NOT NULL,
  	"category" varchar
  );
  
  CREATE TABLE "kitchen_orders_tier_aggregation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tier_name" varchar NOT NULL,
  	"tier_id" varchar
  );
  
  CREATE TABLE "kitchen_orders_allergen_adjustments_allergens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"allergen" varchar
  );
  
  CREATE TABLE "kitchen_orders_allergen_adjustments_meals" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"meal_name" varchar NOT NULL,
  	"adjustment" varchar,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "kitchen_orders_allergen_adjustments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"customer_name" varchar NOT NULL
  );
  
  CREATE TABLE "kitchen_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar,
  	"week_half" "enum_kitchen_orders_week_half" NOT NULL,
  	"total_allergen_charges" numeric DEFAULT 0 NOT NULL,
  	"pickup_date" timestamp(3) with time zone,
  	"status" "enum_kitchen_orders_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer,
  	"menu_items_id" integer,
  	"tiers_id" integer,
  	"weekly_menus_id" integer,
  	"orders_id" integer,
  	"kitchen_orders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"customers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_tier_id_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_texts" ADD CONSTRAINT "customers_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items_allergens" ADD CONSTRAINT "menu_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "weekly_menus_first_half_items" ADD CONSTRAINT "weekly_menus_first_half_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "weekly_menus_first_half_items" ADD CONSTRAINT "weekly_menus_first_half_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "weekly_menus_second_half_items" ADD CONSTRAINT "weekly_menus_second_half_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "weekly_menus_second_half_items" ADD CONSTRAINT "weekly_menus_second_half_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_order_items" ADD CONSTRAINT "orders_order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_order_items" ADD CONSTRAINT "orders_order_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_allergen_charges_matching_allergens" ADD CONSTRAINT "orders_allergen_charges_matching_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_allergen_charges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_allergen_charges" ADD CONSTRAINT "orders_allergen_charges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_tier_id_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "kitchen_orders_order_items_allergens" ADD CONSTRAINT "kitchen_orders_order_items_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders_order_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_order_items" ADD CONSTRAINT "kitchen_orders_order_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_allergen_charges_allergens" ADD CONSTRAINT "kitchen_orders_allergen_charges_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders_allergen_charges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_allergen_charges" ADD CONSTRAINT "kitchen_orders_allergen_charges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_tier_aggregation_meals" ADD CONSTRAINT "kitchen_orders_tier_aggregation_meals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders_tier_aggregation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_tier_aggregation" ADD CONSTRAINT "kitchen_orders_tier_aggregation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_allergen_adjustments_allergens" ADD CONSTRAINT "kitchen_orders_allergen_adjustments_allergens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders_allergen_adjustments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_allergen_adjustments_meals" ADD CONSTRAINT "kitchen_orders_allergen_adjustments_meals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders_allergen_adjustments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kitchen_orders_allergen_adjustments" ADD CONSTRAINT "kitchen_orders_allergen_adjustments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kitchen_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tiers_fk" FOREIGN KEY ("tiers_id") REFERENCES "public"."tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_weekly_menus_fk" FOREIGN KEY ("weekly_menus_id") REFERENCES "public"."weekly_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kitchen_orders_fk" FOREIGN KEY ("kitchen_orders_id") REFERENCES "public"."kitchen_orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_tier_idx" ON "customers" USING btree ("tier_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "customers_texts_order_parent_idx" ON "customers_texts" USING btree ("order","parent_id");
  CREATE INDEX "menu_items_allergens_order_idx" ON "menu_items_allergens" USING btree ("_order");
  CREATE INDEX "menu_items_allergens_parent_id_idx" ON "menu_items_allergens" USING btree ("_parent_id");
  CREATE INDEX "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
  CREATE INDEX "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
  CREATE INDEX "tiers_updated_at_idx" ON "tiers" USING btree ("updated_at");
  CREATE INDEX "tiers_created_at_idx" ON "tiers" USING btree ("created_at");
  CREATE INDEX "weekly_menus_first_half_items_order_idx" ON "weekly_menus_first_half_items" USING btree ("_order");
  CREATE INDEX "weekly_menus_first_half_items_parent_id_idx" ON "weekly_menus_first_half_items" USING btree ("_parent_id");
  CREATE INDEX "weekly_menus_first_half_items_menu_item_idx" ON "weekly_menus_first_half_items" USING btree ("menu_item_id");
  CREATE INDEX "weekly_menus_second_half_items_order_idx" ON "weekly_menus_second_half_items" USING btree ("_order");
  CREATE INDEX "weekly_menus_second_half_items_parent_id_idx" ON "weekly_menus_second_half_items" USING btree ("_parent_id");
  CREATE INDEX "weekly_menus_second_half_items_menu_item_idx" ON "weekly_menus_second_half_items" USING btree ("menu_item_id");
  CREATE INDEX "weekly_menus_updated_at_idx" ON "weekly_menus" USING btree ("updated_at");
  CREATE INDEX "weekly_menus_created_at_idx" ON "weekly_menus" USING btree ("created_at");
  CREATE INDEX "orders_order_items_order_idx" ON "orders_order_items" USING btree ("_order");
  CREATE INDEX "orders_order_items_parent_id_idx" ON "orders_order_items" USING btree ("_parent_id");
  CREATE INDEX "orders_order_items_menu_item_idx" ON "orders_order_items" USING btree ("menu_item_id");
  CREATE INDEX "orders_allergen_charges_matching_allergens_order_idx" ON "orders_allergen_charges_matching_allergens" USING btree ("_order");
  CREATE INDEX "orders_allergen_charges_matching_allergens_parent_id_idx" ON "orders_allergen_charges_matching_allergens" USING btree ("_parent_id");
  CREATE INDEX "orders_allergen_charges_order_idx" ON "orders_allergen_charges" USING btree ("_order");
  CREATE INDEX "orders_allergen_charges_parent_id_idx" ON "orders_allergen_charges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_tier_idx" ON "orders" USING btree ("tier_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "kitchen_orders_order_items_allergens_order_idx" ON "kitchen_orders_order_items_allergens" USING btree ("_order");
  CREATE INDEX "kitchen_orders_order_items_allergens_parent_id_idx" ON "kitchen_orders_order_items_allergens" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_order_items_order_idx" ON "kitchen_orders_order_items" USING btree ("_order");
  CREATE INDEX "kitchen_orders_order_items_parent_id_idx" ON "kitchen_orders_order_items" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_allergen_charges_allergens_order_idx" ON "kitchen_orders_allergen_charges_allergens" USING btree ("_order");
  CREATE INDEX "kitchen_orders_allergen_charges_allergens_parent_id_idx" ON "kitchen_orders_allergen_charges_allergens" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_allergen_charges_order_idx" ON "kitchen_orders_allergen_charges" USING btree ("_order");
  CREATE INDEX "kitchen_orders_allergen_charges_parent_id_idx" ON "kitchen_orders_allergen_charges" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_tier_aggregation_meals_order_idx" ON "kitchen_orders_tier_aggregation_meals" USING btree ("_order");
  CREATE INDEX "kitchen_orders_tier_aggregation_meals_parent_id_idx" ON "kitchen_orders_tier_aggregation_meals" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_tier_aggregation_order_idx" ON "kitchen_orders_tier_aggregation" USING btree ("_order");
  CREATE INDEX "kitchen_orders_tier_aggregation_parent_id_idx" ON "kitchen_orders_tier_aggregation" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_allergen_adjustments_allergens_order_idx" ON "kitchen_orders_allergen_adjustments_allergens" USING btree ("_order");
  CREATE INDEX "kitchen_orders_allergen_adjustments_allergens_parent_id_idx" ON "kitchen_orders_allergen_adjustments_allergens" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_allergen_adjustments_meals_order_idx" ON "kitchen_orders_allergen_adjustments_meals" USING btree ("_order");
  CREATE INDEX "kitchen_orders_allergen_adjustments_meals_parent_id_idx" ON "kitchen_orders_allergen_adjustments_meals" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_allergen_adjustments_order_idx" ON "kitchen_orders_allergen_adjustments" USING btree ("_order");
  CREATE INDEX "kitchen_orders_allergen_adjustments_parent_id_idx" ON "kitchen_orders_allergen_adjustments" USING btree ("_parent_id");
  CREATE INDEX "kitchen_orders_updated_at_idx" ON "kitchen_orders" USING btree ("updated_at");
  CREATE INDEX "kitchen_orders_created_at_idx" ON "kitchen_orders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_tiers_id_idx" ON "payload_locked_documents_rels" USING btree ("tiers_id");
  CREATE INDEX "payload_locked_documents_rels_weekly_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("weekly_menus_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_kitchen_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("kitchen_orders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "customers_texts" CASCADE;
  DROP TABLE "menu_items_allergens" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "tiers" CASCADE;
  DROP TABLE "weekly_menus_first_half_items" CASCADE;
  DROP TABLE "weekly_menus_second_half_items" CASCADE;
  DROP TABLE "weekly_menus" CASCADE;
  DROP TABLE "orders_order_items" CASCADE;
  DROP TABLE "orders_allergen_charges_matching_allergens" CASCADE;
  DROP TABLE "orders_allergen_charges" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "kitchen_orders_order_items_allergens" CASCADE;
  DROP TABLE "kitchen_orders_order_items" CASCADE;
  DROP TABLE "kitchen_orders_allergen_charges_allergens" CASCADE;
  DROP TABLE "kitchen_orders_allergen_charges" CASCADE;
  DROP TABLE "kitchen_orders_tier_aggregation_meals" CASCADE;
  DROP TABLE "kitchen_orders_tier_aggregation" CASCADE;
  DROP TABLE "kitchen_orders_allergen_adjustments_allergens" CASCADE;
  DROP TABLE "kitchen_orders_allergen_adjustments_meals" CASCADE;
  DROP TABLE "kitchen_orders_allergen_adjustments" CASCADE;
  DROP TABLE "kitchen_orders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_customers_week_half";
  DROP TYPE "public"."enum_menu_items_category";
  DROP TYPE "public"."enum_orders_order_items_week_half";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_subscription_frequency";
  DROP TYPE "public"."enum_orders_week_half";
  DROP TYPE "public"."enum_kitchen_orders_week_half";
  DROP TYPE "public"."enum_kitchen_orders_status";`)
}
