import * as migration_20251214_204101_initials from './20251214_204101_initials';
import * as migration_20251214_212526_seed_tiers from './20251214_212526_seed_tiers';
import * as migration_20251214_221223_add_meal_preferences from './20251214_221223_add_meal_preferences';
import * as migration_20251214_224859_remove_tier_prices from './20251214_224859_remove_tier_prices';
import * as migration_20251221_042908_add_weekly_menu from './20251221_042908_add_weekly_menu';
import * as migration_20251221_044511_update_weekly_menu from './20251221_044511_update_weekly_menu';

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
    name: '20251214_221223_add_meal_preferences',
  },
  {
    up: migration_20251214_224859_remove_tier_prices.up,
    down: migration_20251214_224859_remove_tier_prices.down,
    name: '20251214_224859_remove_tier_prices',
  },
  {
    up: migration_20251221_042908_add_weekly_menu.up,
    down: migration_20251221_042908_add_weekly_menu.down,
    name: '20251221_042908_add_weekly_menu',
  },
  {
    up: migration_20251221_044511_update_weekly_menu.up,
    down: migration_20251221_044511_update_weekly_menu.down,
    name: '20251221_044511_update_weekly_menu'
  },
];
