import * as migration_20251214_204101_initials from './20251214_204101_initials';
import * as migration_20251214_212526_seed_tiers from './20251214_212526_seed_tiers';
import * as migration_20251214_221223_add_meal_preferences from './20251214_221223_add_meal_preferences';

export const migrations = [
  {
    up: migration_20251214_204101_initials.up,
    down: migration_20251214_204101_initials.down,
    name: '20251214_204101_initials',
  },
  {
    up: migration_20251214_212526_seed_tiers.up,
    down: migration_20251214_212526_seed_tiers.down,
    name: '20251214_212526_seed_tiers',
  },
  {
    up: migration_20251214_221223_add_meal_preferences.up,
    down: migration_20251214_221223_add_meal_preferences.down,
    name: '20251214_221223_add_meal_preferences'
  },
];
