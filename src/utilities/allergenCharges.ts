import type { MenuItem, Customer } from '@/payload-types'

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

const ALLERGEN_CHARGE_PER_MEAL = 5.00

/**
 * Calculates allergen charges for selected meals based on customer allergies
 * @param selectedMeals - Array of selected meals with quantities
 * @param userAllergies - Array of customer's allergies
 * @returns Object containing allergen charges breakdown and total
 */
export function calculateAllergenCharges(
  selectedMeals: { meal: MenuItem; quantity: number }[],
  userAllergies: string[]
): AllergenChargeResult {
  const allergenCharges: AllergenCharge[] = []
  let totalAllergenCharges = 0

  selectedMeals.forEach((item) => {
    const mealAllergens = item.meal.allergens || []
    
    // Find allergens in the meal that match the customer's allergies
    const matchingAllergens = mealAllergens.filter((mealAllergen) =>
      userAllergies.includes(mealAllergen.allergen)
    )

    if (matchingAllergens.length > 0) {
      const allergensWithCharges = matchingAllergens.map((allergen) => ({
        allergen: allergen.allergen,
        charge: ALLERGEN_CHARGE_PER_MEAL,
      }))

      // Calculate total charge for this meal: $5 per allergen × quantity
      const totalChargeForMeal = matchingAllergens.length * ALLERGEN_CHARGE_PER_MEAL * item.quantity
      totalAllergenCharges += totalChargeForMeal

      allergenCharges.push({
        mealId: item.meal.id.toString(),
        mealName: item.meal.name,
        quantity: item.quantity,
        matchingAllergens: allergensWithCharges,
        totalAllergenCharge: totalChargeForMeal,
      })
    }
  })

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
  return mealAllergens.some((mealAllergen) => userAllergies.includes(mealAllergen.allergen))
}

/**
 * Gets the list of allergens in a meal that match customer allergies
 * @param meal - The menu item to check
 * @param userAllergies - Array of customer's allergies
 * @returns Array of matching allergen names
 */
export function getMatchingAllergens(meal: MenuItem, userAllergies: string[]): string[] {
  const mealAllergens = meal.allergens || []
  return mealAllergens
    .filter((mealAllergen) => userAllergies.includes(mealAllergen.allergen))
    .map((allergen) => allergen.allergen)
}

/**
 * Calculates total allergen charges for display purposes
 * @param selectedMeals - Array of selected meals with quantities
 * @param userAllergies - Array of customer's allergies
 * @returns Total allergen charges amount
 */
export function calculateTotalAllergenCharges(
  selectedMeals: { meal: MenuItem; quantity: number }[],
  userAllergies: string[]
): number {
  const { totalAllergenCharges } = calculateAllergenCharges(selectedMeals, userAllergies)
  return totalAllergenCharges
}
