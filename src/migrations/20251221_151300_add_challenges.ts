import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    -- Create enum for challenge status
    CREATE TYPE "public"."enum_challenges_status" AS ENUM('upcoming', 'registration', 'active', 'completed', 'cancelled');
    
    -- Create enum for challenge participant status
    CREATE TYPE "public"."enum_challenge_participants_status" AS ENUM('registered', 'active', 'completed', 'dropped');
    
    -- Create enum for challenge participant payment status
    CREATE TYPE "public"."enum_challenge_participants_payment_status" AS ENUM('pending', 'paid', 'refunded');

    -- Create challenges table
    CREATE TABLE "challenges" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" jsonb,
      "start_date" timestamp(3) with time zone NOT NULL,
      "end_date" timestamp(3) with time zone,
      "registration_deadline" timestamp(3) with time zone NOT NULL,
      "price" numeric NOT NULL,
      "max_participants" numeric,
      "status" "enum_challenges_status" DEFAULT 'upcoming' NOT NULL,
      "meals_per_day" numeric DEFAULT 3,
      "days_per_week" numeric DEFAULT 7,
      "snacks_per_week" numeric DEFAULT 2,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Create challenge_participants table
    CREATE TABLE "challenge_participants" (
      "id" serial PRIMARY KEY NOT NULL,
      "challenge_id" integer NOT NULL,
      "customer_id" integer NOT NULL,
      "tier_id" integer NOT NULL,
      "status" "enum_challenge_participants_status" DEFAULT 'registered' NOT NULL,
      "registered_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "payment_status" "enum_challenge_participants_payment_status" DEFAULT 'pending' NOT NULL,
      "payment_id" varchar,
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Create weeks_completed array table for challenge_participants
    CREATE TABLE "challenge_participants_weeks_completed" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "week_number" numeric NOT NULL,
      "order_id" integer
    );

    -- Add challenge reference to orders table
    ALTER TABLE "orders" ADD COLUMN "challenge_id" integer;
    ALTER TABLE "orders" ADD COLUMN "challenge_week" numeric;

    -- Add foreign key constraints
    ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_challenges_id_fk" 
      FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_customer_id_customers_id_fk" 
      FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_tier_id_tiers_id_fk" 
      FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("id") ON DELETE set null ON UPDATE no action;
    
    ALTER TABLE "challenge_participants_weeks_completed" ADD CONSTRAINT "challenge_participants_weeks_completed_parent_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "public"."challenge_participants"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "challenge_participants_weeks_completed" ADD CONSTRAINT "challenge_participants_weeks_completed_order_id_orders_id_fk" 
      FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "orders" ADD CONSTRAINT "orders_challenge_id_challenges_id_fk" 
      FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE set null ON UPDATE no action;

    -- Create indexes
    CREATE INDEX "challenges_created_at_idx" ON "challenges" USING btree ("created_at");
    CREATE INDEX "challenge_participants_challenge_idx" ON "challenge_participants" USING btree ("challenge_id");
    CREATE INDEX "challenge_participants_customer_idx" ON "challenge_participants" USING btree ("customer_id");
    CREATE INDEX "challenge_participants_tier_idx" ON "challenge_participants" USING btree ("tier_id");
    CREATE INDEX "challenge_participants_created_at_idx" ON "challenge_participants" USING btree ("created_at");
    CREATE INDEX "challenge_participants_weeks_completed_order_idx" ON "challenge_participants_weeks_completed" USING btree ("_order");
    CREATE INDEX "challenge_participants_weeks_completed_parent_id_idx" ON "challenge_participants_weeks_completed" USING btree ("_parent_id");
    CREATE INDEX "orders_challenge_idx" ON "orders" USING btree ("challenge_id");

    -- Add to payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "challenges_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "challenge_participants_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_challenges_fk" 
      FOREIGN KEY ("challenges_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_challenge_participants_fk" 
      FOREIGN KEY ("challenge_participants_id") REFERENCES "public"."challenge_participants"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_challenges_id_idx" ON "payload_locked_documents_rels" USING btree ("challenges_id");
    CREATE INDEX "payload_locked_documents_rels_challenge_participants_id_idx" ON "payload_locked_documents_rels" USING btree ("challenge_participants_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    -- Remove from payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_challenges_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_challenge_participants_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_challenges_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_challenge_participants_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "challenges_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "challenge_participants_id";

    -- Remove challenge reference from orders
    DROP INDEX IF EXISTS "orders_challenge_idx";
    ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_challenge_id_challenges_id_fk";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "challenge_id";
    ALTER TABLE "orders" DROP COLUMN IF EXISTS "challenge_week";

    -- Drop tables
    ALTER TABLE "challenge_participants_weeks_completed" DROP CONSTRAINT IF EXISTS "challenge_participants_weeks_completed_parent_id_fk";
    ALTER TABLE "challenge_participants_weeks_completed" DROP CONSTRAINT IF EXISTS "challenge_participants_weeks_completed_order_id_orders_id_fk";
    DROP TABLE IF EXISTS "challenge_participants_weeks_completed" CASCADE;
    
    ALTER TABLE "challenge_participants" DROP CONSTRAINT IF EXISTS "challenge_participants_challenge_id_challenges_id_fk";
    ALTER TABLE "challenge_participants" DROP CONSTRAINT IF EXISTS "challenge_participants_customer_id_customers_id_fk";
    ALTER TABLE "challenge_participants" DROP CONSTRAINT IF EXISTS "challenge_participants_tier_id_tiers_id_fk";
    DROP TABLE IF EXISTS "challenge_participants" CASCADE;
    DROP TABLE IF EXISTS "challenges" CASCADE;

    -- Drop enums
    DROP TYPE IF EXISTS "public"."enum_challenge_participants_payment_status";
    DROP TYPE IF EXISTS "public"."enum_challenge_participants_status";
    DROP TYPE IF EXISTS "public"."enum_challenges_status";
  `)
}
