import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Helper function to generate allergen adjustment description
function generateAdjustmentDescription(
  mealAllergens: Array<{ allergen: string }>,
  customerAllergens: string[],
): string {
  const matchingAllergens = mealAllergens
    .map((a) => a.allergen)
    .filter((allergen) => customerAllergens.includes(allergen))

  if (matchingAllergens.length === 0) return ''

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

  if (adjustments.length > 0) {
    return adjustments.join(', ')
  }

  return `without ${matchingAllergens.join(', ')}`
}

// Helper to escape CSV values
function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
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
      depth: 2,
    })

    if (!orders || !orders.docs || !Array.isArray(orders.docs)) {
      return NextResponse.json(
        {
          message: 'No orders found',
        },
        { status: 404 },
      )
    }

    // Aggregate by tier and meal
    const tierMap = new Map<string, Map<string, { quantity: number; category: string }>>()
    const tierNameMap = new Map<string, string>()
    const allergenAdjustmentsMap = new Map<
      string,
      {
        customerName: string
        allergens: string[]
        meals: Map<string, { adjustment: string; quantity: number; mealName: string }>
      }
    >()

    // Get all menu items to map categories
    const menuItems = await payload.find({
      collection: 'menu-items',
      limit: 1000,
    })
    const menuItemMap = new Map(
      menuItems.docs.map((item) => [String(item.id), { name: item.name, category: item.category }]),
    )

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
        const menuItemData =
          typeof menuItem === 'object'
            ? menuItem
            : menuItemMap.get(String(menuItemId)) || { name: 'Unknown', category: '' }

        if (!menuItemData || !menuItemData.name) {
          console.warn(`Menu item ${menuItemId} not found or invalid`)
          continue
        }

        const mealName = menuItemData.name || 'Unknown'
        const quantity = item.quantity || 0
        const category = menuItemData.category || ''

        // Add to tier aggregation
        const current = mealMap.get(mealName) || { quantity: 0, category }
        mealMap.set(mealName, {
          quantity: current.quantity + quantity,
          category,
        })

        // Check for allergen adjustments
        if (customerAllergens.length > 0) {
          let menuItemFull
          try {
            menuItemFull =
              typeof menuItem === 'object'
                ? menuItem
                : await payload.findByID({
                    collection: 'menu-items',
                    id: menuItemId,
                  })
          } catch (err) {
            console.error(`Error fetching menu item ${menuItemId} for allergens:`, err)
            continue
          }

          if (!menuItemFull) {
            continue
          }

          const adjustment = generateAdjustmentDescription(
            Array.isArray(menuItemFull.allergens) ? menuItemFull.allergens : [],
            customerAllergens,
          )

          if (adjustment) {
            if (!allergenAdjustmentsMap.has(String(customerId))) {
              allergenAdjustmentsMap.set(String(customerId), {
                customerName,
                allergens: customerAllergens,
                meals: new Map(),
              })
            }

            const customerAdjustment = allergenAdjustmentsMap.get(String(customerId))!
            const mealKey = `${mealName}|${adjustment}`
            const currentAdj = customerAdjustment.meals.get(mealKey)
            customerAdjustment.meals.set(mealKey, {
              adjustment,
              quantity: (currentAdj?.quantity || 0) + quantity,
              mealName,
            })
          }
        }
      }
    }

    // Build CSV content
    const csvLines: string[] = []

    // Header
    csvLines.push('KITCHEN ORDER REPORT')
    csvLines.push(`Generated: ${new Date().toLocaleString()}`)
    if (weekHalf) {
      csvLines.push(`Week Half: ${weekHalf === 'firstHalf' ? 'First Half' : 'Second Half'}`)
    }
    csvLines.push('')

    // Get all unique meals that have at least 1 order across all tiers
    const allMealsSet = new Set<string>()
    for (const mealMap of tierMap.values()) {
      for (const [mealName, data] of mealMap.entries()) {
        if (data.quantity > 0) {
          allMealsSet.add(mealName)
        }
      }
    }
    const allMeals = Array.from(allMealsSet).sort()

    // Tier Aggregation Section - Pivot table format
    csvLines.push('=== TIER AGGREGATION ===')

    // Header row: Tier, then all meals
    const headerRow = ['Tier', ...allMeals.map((meal) => escapeCsvValue(meal))].join(',')
    csvLines.push(headerRow)

    // Data rows: one row per tier (only include tiers with at least one order)
    const sortedTiers = Array.from(tierMap.entries())
      .filter(([_tierId, mealMap]) => {
        // Check if tier has any orders (at least one meal with quantity > 0)
        for (const data of mealMap.values()) {
          if (data.quantity > 0) {
            return true
          }
        }
        return false
      })
      .sort((a, b) => {
        const tierNameA = tierNameMap.get(a[0]) || 'Unknown'
        const tierNameB = tierNameMap.get(b[0]) || 'Unknown'
        return tierNameA.localeCompare(tierNameB)
      })

    for (const [tierId, mealMap] of sortedTiers) {
      const tierName = tierNameMap.get(tierId) || 'Unknown'
      const rowValues = [escapeCsvValue(tierName)]

      for (const meal of allMeals) {
        const data = mealMap.get(meal)
        const quantity = data?.quantity || 0
        // Leave blank if quantity is 0
        rowValues.push(quantity > 0 ? String(quantity) : '')
      }

      csvLines.push(rowValues.join(','))
    }

    csvLines.push('')

    // Allergen Adjustments Section
    csvLines.push('=== ALLERGEN ADJUSTMENTS ===')
    csvLines.push('Customer Name,Allergens,Meal,Adjustment,Quantity')

    for (const adjustment of Array.from(allergenAdjustmentsMap.values()).sort((a, b) =>
      a.customerName.localeCompare(b.customerName),
    )) {
      if (!adjustment || !adjustment.customerName) continue
      const allergensStr = Array.isArray(adjustment.allergens)
        ? adjustment.allergens.join('; ')
        : ''
      for (const mealData of Array.from(adjustment.meals.values()).sort((a, b) =>
        a.mealName.localeCompare(b.mealName),
      )) {
        if (!mealData || !mealData.mealName) continue
        const line = `${escapeCsvValue(adjustment.customerName)},${escapeCsvValue(allergensStr)},${escapeCsvValue(mealData.mealName)},${escapeCsvValue(mealData.adjustment || '')},${mealData.quantity ?? 0}`
        if (line) {
          csvLines.push(line)
        }
      }
    }

    // Filter out any undefined/null/empty lines and ensure all are strings
    const validCsvLines = csvLines
      .map((line) => {
        if (line === undefined || line === null) return null
        const str = String(line)
        return str.trim() === '' ? null : str
      })
      .filter((line): line is string => line !== null)

    if (validCsvLines.length === 0) {
      return NextResponse.json(
        {
          message: 'No data available for CSV export',
        },
        { status: 404 },
      )
    }

    const csvContent = validCsvLines.join('\n')

    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        {
          message: 'No data available for CSV export',
        },
        { status: 404 },
      )
    }

    // Return CSV file - ensure we're passing a valid string
    return new NextResponse(String(csvContent), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kitchen-report-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json(
      {
        message: 'Failed to generate CSV',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
