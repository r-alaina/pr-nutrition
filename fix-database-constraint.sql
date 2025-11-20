-- Fix foreign key constraint violation in Railway database
-- This script removes orphaned records from payload_preferences_rels
-- that reference non-existent users

-- Step 1: Remove orphaned preference relationships
DELETE FROM payload_preferences_rels 
WHERE users_id NOT IN (SELECT id FROM users);

-- Step 2: If the constraint still exists and is causing issues, 
-- you may need to drop and recreate it
-- First, drop the constraint if it exists
ALTER TABLE payload_preferences_rels 
DROP CONSTRAINT IF EXISTS payload_preferences_rels_users_fk;

-- Step 3: Recreate the constraint
ALTER TABLE payload_preferences_rels 
ADD CONSTRAINT payload_preferences_rels_users_fk 
FOREIGN KEY (users_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

