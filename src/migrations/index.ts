import * as migration_20251214_204101_initials from './20251214_204101_initials';
import * as migration_20251214_212526_seed_tiers from './20251214_212526_seed_tiers';

export const migrations = [
  {
    up: migration_20251214_204101_initials.up,
    down: migration_20251214_204101_initials.down,
    name: '20251214_204101_initials',
  },
  {
    up: migration_20251214_212526_seed_tiers.up,
    down: migration_20251214_212526_seed_tiers.down,
    name: '20251214_212526_seed_tiers'
  },
];
