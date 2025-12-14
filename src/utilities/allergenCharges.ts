import type { MenuItem } from '@/payload-types'
import { normalizeAllergen } from './allergens'

export interface AllergenCharge {
  mealId: string
  mealName: string
  quantity: number
  matchingAllergens: {
    allergen: string
    charge: number
  }[]
  totalAllergenCharge: number
}

export interface AllergenChargeResult {
  allergenCharges: AllergenCharge[]
  totalAllergenCharges: number
}

const ALLERGEN_CHARGE_PER_ORDER = 5.0

/**
 * Calculates allergen charges for selected meals based on customer allergies
 * Charges $5 total per order if customer has any allergens, regardless of quantity
 * @param selectedMeals - Array of selected meals with quantities
 * @param userAllergies - Array of customer's allergies
 * @returns Object containing allergen charges breakdown and total
 */
export function calculateAllergenCharges(
  selectedMeals: { meal: MenuItem; quantity: number }[],
  userAllergies: string[],
): AllergenChargeResult {
  const allergenCharges: AllergenCharge[] = []
  let hasAnyAllergenConflict = false

  // First pass: Check if there are any allergen conflicts across all meals
  selectedMeals.forEach((item) => {
    const mealAllergens = item.meal.allergens || []
    
    // Normalize user allergies for comparison
    const normalizedUserAllergies = userAllergies.map(normalizeAllergen)

    const matchingAllergens = mealAllergens.filter((mealAllergen) => {
      const normalizedMealAllergen = normalizeAllergen(mealAllergen.allergen || '')
      return normalizedUserAllergies.includes(normalizedMealAllergen)
    })

    if (matchingAllergens.length > 0) {
      hasAnyAllergenConflict = true

      // Track which meals have allergens for reporting purposes
      const allergensWithCharges = matchingAllergens.map((allergen) => ({
        allergen: allergen.allergen || '',
        charge: 0, // Individual allergen charge is 0, charge is per order
      }))

      allergenCharges.push({
        mealId: item.meal.id.toString(),
        mealName: item.meal.name,
        quantity: item.quantity,
        matchingAllergens: allergensWithCharges,
        totalAllergenCharge: 0, // Per-meal charge is 0, charge is per order
      })
    }
  })

  // If there are any allergen conflicts, charge $5 total for the entire order
  const totalAllergenCharges = hasAnyAllergenConflict ? ALLERGEN_CHARGE_PER_ORDER : 0

  return { allergenCharges, totalAllergenCharges }
}

/**
 * Checks if a meal has allergen conflicts with customer allergies
 * @param meal - The menu item to check
 * @param userAllergies - Array of customer's allergies
 * @returns True if there are allergen conflicts
 */
export function hasAllergenConflict(meal: MenuItem, userAllergies: string[]): boolean {
  const mealAllergens = meal.allergens || []
  const normalizedUserAllergies = userAllergies.map(normalizeAllergen)
  
  return mealAllergens.some((mealAllergen) => {
    const normalizedMealAllergen = normalizeAllergen(mealAllergen.allergen || '')
    return normalizedUserAllergies.includes(normalizedMealAllergen)
  })
}

/**
 * Gets the list of allergens in a meal that match customer allergies
 * @param meal - The menu item to check
 * @param userAllergies - Array of customer's allergies
 * @returns Array of matching allergen names
 */
export function getMatchingAllergens(meal: MenuItem, userAllergies: string[]): string[] {
  const mealAllergens = meal.allergens || []
  const normalizedUserAllergies = userAllergies.map(normalizeAllergen)
  
  return mealAllergens
    .filter((mealAllergen) => {
      const normalizedMealAllergen = normalizeAllergen(mealAllergen.allergen || '')
      return normalizedUserAllergies.includes(normalizedMealAllergen)
    })
    .map((allergen) => allergen.allergen || '')
}

/**
 * Calculates total allergen charges for display purposes
 * @param selectedMeals - Array of selected meals with quantities
 * @param userAllergies - Array of customer's allergies
 * @returns Total allergen charges amount
 */
export function calculateTotalAllergenCharges(
  selectedMeals: { meal: MenuItem; quantity: number }[],
  userAllergies: string[],
): number {
  const { totalAllergenCharges } = calculateAllergenCharges(selectedMeals, userAllergies)
  return totalAllergenCharges
}
