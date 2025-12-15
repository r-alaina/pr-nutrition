export const ALLERGENS = [
  'Nuts',
  'Dairy',
  'Gluten',
  'Shellfish',
  'Soy',
  'Eggs',
  'Corn',
  'Beans',
] as const

export type Allergen = (typeof ALLERGENS)[number]

/**
 * Normalizes an allergen string to a standard format for comparison.
 * Maps 'lactose' to 'dairy' for backward compatibility.
 * Removes whitespace and converts to lowercase.
 */
export function normalizeAllergen(allergen: string): string {
  if (!allergen) return ''
  const normalized = allergen.trim().toLowerCase()
  
  if (normalized === 'lactose') {
    return 'dairy'
  }
  
  return normalized
}

/**
 * Checks if two allergen strings are equivalent.
 */
export function areAllergensEqual(a: string, b: string): boolean {
  return normalizeAllergen(a) === normalizeAllergen(b)
}

/**
 * Formats an allergen string for display (e.g. capitalize first letter)
 */
export function formatAllergen(allergen: string): string {
  const normalized = normalizeAllergen(allergen)
  if (!normalized) return ''
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

/**
 * Maps an allergen string to its canonical form from ALLERGENS if possible.
 * Handles 'lactose' -> 'Dairy' mapping and case insensitivity.
 */
export function toCanonicalAllergen(allergen: string): string {
  const normalized = normalizeAllergen(allergen)
  const match = ALLERGENS.find((a) => normalizeAllergen(a) === normalized)
  if (match) return match
  
  // Fallback to title case
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}
