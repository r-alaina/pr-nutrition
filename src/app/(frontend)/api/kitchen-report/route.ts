import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface TierAggregation {
  tierName: string
  tierId: string | number
  meals: Array<{
    mealName: string
    quantity: number
    category: string
  }>
}

interface AllergenAdjustment {
  customerName: string
  customerEmail: string
  allergens: string[]
  meals: Array<{
    mealName: string
    adjustment: string
    quantity: number
  }>
}

interface KitchenReport {
  tierAggregations: TierAggregation[]
  allergenAdjustments: AllergenAdjustment[]
  weekHalf?: string
  reportDate: string
}

// Helper function to generate allergen adjustment description
function generateAdjustmentDescription(
  mealAllergens: Array<{ allergen: string }>,
  customerAllergens: string[],
): string {
  const matchingAllergens = mealAllergens
    .map((a) => a.allergen)
    .filter((allergen) => customerAllergens.includes(allergen))

  if (matchingAllergens.length === 0) return ''

  // Generate adjustment text based on allergens
  const adjustments: string[] = []
  if (matchingAllergens.includes('Dairy') || matchingAllergens.includes('dairy')) {
    adjustments.push('without cheese')
  }
  if (matchingAllergens.includes('Gluten') || matchingAllergens.includes('gluten')) {
    adjustments.push('gluten-free')
  }
  if (matchingAllergens.includes('Nuts') || matchingAllergens.includes('nuts')) {
    adjustments.push('no nuts')
  }
  if (matchingAllergens.includes('Corn') || matchingAllergens.includes('corn')) {
    adjustments.push('no corn')
  }
  if (matchingAllergens.includes('Beans') || matchingAllergens.includes('beans')) {
    adjustments.push('no beans')
  }

  // If we have specific adjustments, use them; otherwise list allergens
  if (adjustments.length > 0) {
    return adjustments.join(', ')
  }

  return `without ${matchingAllergens.join(', ')}`
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const weekHalf = searchParams.get('weekHalf') || undefined
    // Build query for orders
    const orderQuery: any = {
      status: {
        in: ['confirmed', 'preparing', 'ready', 'pending'],
      },
    }

    if (weekHalf) {
      orderQuery.weekHalf = {
        in: [weekHalf, 'both'],
      }
    }

    // Get all relevant orders
    const orders = await payload.find({
      collection: 'orders',
      where: orderQuery,
      limit: 1000,
      depth: 2, // Get full tier and menu item details
    })

    if (!orders || !orders.docs || !Array.isArray(orders.docs)) {
      return NextResponse.json({
        tierAggregations: [],
        allergenAdjustments: [],
        weekHalf: weekHalf || undefined,
        reportDate: new Date().toISOString(),
      })
    }

    // Aggregate by tier and meal
    // Map<tierId, Map<mealName, { quantity: number, category: string }>>
    const tierMap = new Map<string, Map<string, { quantity: number; category: string }>>()
    const tierNameMap = new Map<string, string>() // tierId -> tierName
    const allergenAdjustmentsMap = new Map<
      string,
      {
        customerName: string
        customerEmail: string
        allergens: string[]
        meals: Map<string, { adjustment: string; quantity: number }>
      }
    >() // customerId -> adjustment data

    // Process each order
    for (const order of orders.docs) {
      const tier = order.tier
      if (!tier) continue

      const tierId = typeof tier === 'object' ? tier.id : tier
      const tierName = typeof tier === 'object' ? tier.tier_name : 'Unknown'
      tierNameMap.set(String(tierId), tierName)

      // Get customer info
      const customer = order.customer
      if (!customer) continue

      const customerId = typeof customer === 'object' ? customer.id : customer
      const customerName =
        typeof customer === 'object' ? customer.name || customer.email : 'Unknown'
      const customerEmail = typeof customer === 'object' ? customer.email : ''
      const customerAllergens =
        typeof customer === 'object' && Array.isArray(customer.allergies) ? customer.allergies : []

      // Initialize tier aggregation if needed
      if (!tierMap.has(String(tierId))) {
        tierMap.set(String(tierId), new Map())
      }
      const mealMap = tierMap.get(String(tierId))!

      // Process order items
      for (const item of order.orderItems || []) {
        const menuItem = item.menuItem
        if (!menuItem) continue

        const menuItemId = typeof menuItem === 'object' ? menuItem.id : menuItem
        let menuItemData
        try {
          menuItemData =
            typeof menuItem === 'object'
              ? menuItem
              : await payload.findByID({
                  collection: 'menu-items',
                  id: menuItemId,
                })
        } catch (err) {
          console.error(`Error fetching menu item ${menuItemId}:`, err)
          continue
        }

        if (!menuItemData) {
          console.warn(`Menu item ${menuItemId} not found`)
          continue
        }

        const mealName = menuItemData?.name || 'Unknown'
        const quantity = item.quantity || 0
        const category = menuItemData?.category || ''

        // Add to tier aggregation
        const current = mealMap.get(mealName) || { quantity: 0, category }
        mealMap.set(mealName, {
          quantity: current.quantity + quantity,
          category,
        })

        // Check for allergen adjustments
        if (customerAllergens.length > 0 && menuItemData?.allergens) {
          const adjustment = generateAdjustmentDescription(
            Array.isArray(menuItemData.allergens) ? menuItemData.allergens : [],
            customerAllergens,
          )

          if (adjustment) {
            // Initialize customer adjustment if needed
            if (!allergenAdjustmentsMap.has(String(customerId))) {
              allergenAdjustmentsMap.set(String(customerId), {
                customerName,
                customerEmail,
                allergens: customerAllergens,
                meals: new Map(),
              })
            }

            const customerAdjustment = allergenAdjustmentsMap.get(String(customerId))!
            const mealKey = `${mealName}|${adjustment}`
            const currentAdjQty = customerAdjustment.meals.get(mealKey)?.quantity || 0
            customerAdjustment.meals.set(mealKey, {
              adjustment,
              quantity: currentAdjQty + quantity,
            })
          }
        }
      }
    }

    // Get all unique meals that have at least 1 order across all tiers
    const allMealsSet = new Set<string>()
    // Also track categories for each meal
    const mealCategoryMap = new Map<string, string>()

    for (const mealMap of tierMap.values()) {
      for (const [mealName, data] of mealMap.entries()) {
        if (data.quantity > 0) {
          allMealsSet.add(mealName)
          if (data.category) {
            mealCategoryMap.set(mealName, data.category)
          }
        }
      }
    }
    const allMeals = Array.from(allMealsSet).sort()

    // Convert tier aggregation to pivot table format
    // Each tier should include all meals (even if quantity is 0) for consistent table structure
    const tierAggregations = Array.from(tierMap.entries())
      .map(([tierId, mealMap]) => {
        if (!mealMap || mealMap.size === 0) return null

        // Include all meals that have at least 1 order somewhere, but only show quantity if > 0
        const meals = allMeals
          .map((mealName) => {
            const data = mealMap.get(mealName)
            const quantity = data?.quantity || 0
            // Only include meals with quantity > 0 for this tier
            if (quantity === 0) return null
            return {
              mealName: String(mealName),
              quantity: Number(quantity),
              category: mealCategoryMap.get(mealName) || '',
            }
          })
          .filter(
            (meal): meal is { mealName: string; quantity: number; category: string } =>
              meal !== null,
          )

        // Include tier even if it has no meals (will show empty row in table)
        return {
          tierName: tierNameMap.get(tierId) || 'Unknown',
          tierId,
          meals,
        }
      })
      .filter((tier): tier is TierAggregation => tier !== null)
      .sort((a, b) => a.tierName.localeCompare(b.tierName)) as TierAggregation[]

    // Convert allergen adjustments to array format
    const allergenAdjustments: AllergenAdjustment[] = Array.from(allergenAdjustmentsMap.values())
      .filter((adj) => adj && adj.customerName)
      .map((adj) => ({
        customerName: String(adj.customerName || 'Unknown'),
        customerEmail: String(adj.customerEmail || ''),
        allergens: Array.isArray(adj.allergens) ? adj.allergens.map(String) : [],
        meals: Array.from(adj.meals.entries())
          .map(([mealKey, data]) => {
            if (!data || !mealKey) return null
            const [mealName] = mealKey.split('|')
            return {
              mealName: String(mealName || 'Unknown'),
              adjustment: String(data.adjustment || ''),
              quantity: Number(data.quantity) || 0,
            }
          })
          .filter(
            (meal): meal is { mealName: string; adjustment: string; quantity: number } =>
              meal !== null,
          ),
      }))

    const report: KitchenReport = {
      tierAggregations: Array.isArray(tierAggregations) ? tierAggregations : [],
      allergenAdjustments: Array.isArray(allergenAdjustments) ? allergenAdjustments : [],
      weekHalf: weekHalf || undefined,
      reportDate: new Date().toISOString(),
    }

    // Ensure all values are serializable
    const serializableReport = JSON.parse(JSON.stringify(report))
    return NextResponse.json(serializableReport)
  } catch (error) {
    console.error('Error generating kitchen report:', error)
    return NextResponse.json(
      {
        message: 'Failed to generate kitchen report',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
