'use client'

import { useState, useEffect } from 'react'

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

export default function KitchenReportView() {
  const [report, setReport] = useState<KitchenReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekHalf, setWeekHalf] = useState<string>('firstHalf')

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekHalf])

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/kitchen-report?weekHalf=${weekHalf}`)
      if (!response.ok) {
        throw new Error('Failed to fetch report')
      }
      const data = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    window.open(`/api/kitchen-report/csv?weekHalf=${weekHalf}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#000000' }}>
        <p style={{ color: '#000000' }}>Loading kitchen report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#000000' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={fetchReport}>Retry</button>
      </div>
    )
  }

  if (!report) {
    return (
      <div style={{ padding: '2rem', color: '#000000' }}>
        <p style={{ color: '#000000' }}>No report data available</p>
      </div>
    )
  }

  // Get all unique meals that have at least 1 order across all tiers
  const allMealsSet = new Set<string>()
  for (const tier of report.tierAggregations) {
    for (const meal of tier.meals) {
      if (meal.quantity > 0) {
        allMealsSet.add(meal.mealName)
      }
    }
  }
  const allMeals = Array.from(allMealsSet).sort()

  // Create a map for quick lookup: tier -> meal -> quantity
  const tierMealMap = new Map<string, Map<string, number>>()
  for (const tier of report.tierAggregations) {
    const mealMap = new Map<string, number>()
    for (const meal of tier.meals) {
      mealMap.set(meal.mealName, meal.quantity)
    }
    tierMealMap.set(tier.tierName, mealMap)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#000000' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ margin: 0, color: '#000000' }}>Kitchen Order Report</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: '#000000' }}>
            Week Half:
            <select
              value={weekHalf}
              onChange={(e) => setWeekHalf(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                color: '#000000',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: 'none',
                boxShadow: 'none',
              }}
            >
              <option value="firstHalf">First Half</option>
              <option value="secondHalf">Second Half</option>
            </select>
          </label>
          <button
            onClick={downloadCSV}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#5CB85C',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Tier Aggregation Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            marginBottom: '1rem',
            borderBottom: '2px solid #5CB85C',
            paddingBottom: '0.5rem',
            color: '#000000',
          }}
        >
          Tier Aggregation
        </h2>
        {report.tierAggregations.length === 0 ? (
          <p style={{ color: '#000000' }}>No tier aggregations available</p>
        ) : allMeals.length === 0 ? (
          <p style={{ color: '#000000' }}>No meals with orders found</p>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '600px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #e5e7eb',
                      color: '#000000',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#f3f4f6',
                      zIndex: 1,
                    }}
                  >
                    Tier
                  </th>
                  {allMeals.map((meal) => (
                    <th
                      key={meal}
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        border: '1px solid #e5e7eb',
                        color: '#000000',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.tierAggregations.map((tier) => {
                  const mealMap = tierMealMap.get(tier.tierName) || new Map()
                  return (
                    <tr key={tier.tierId}>
                      <td
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          color: '#000000',
                          fontWeight: 'bold',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: '#ffffff',
                          zIndex: 1,
                        }}
                      >
                        {tier.tierName}
                      </td>
                      {allMeals.map((meal) => {
                        const quantity = mealMap.get(meal) || 0
                        return (
                          <td
                            key={meal}
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              border: '1px solid #e5e7eb',
                              color: '#000000',
                            }}
                          >
                            {quantity > 0 ? quantity : ''}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Allergen Adjustments Section */}
      <section>
        <h2
          style={{
            marginBottom: '1rem',
            borderBottom: '2px solid #5CB85C',
            paddingBottom: '0.5rem',
            color: '#000000',
          }}
        >
          Allergen Adjustments
        </h2>
        {report.allergenAdjustments.length === 0 ? (
          <p style={{ color: '#000000' }}>No allergen adjustments needed</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {report.allergenAdjustments.map((adjustment, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#fff7ed',
                  borderRadius: '0.5rem',
                  border: '1px solid #fed7aa',
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#000000' }}>
                    {adjustment.customerName}
                  </h3>
                  <p style={{ margin: 0, color: '#000000', fontSize: '0.9rem' }}>
                    Allergens: {adjustment.allergens.join(', ')}
                  </p>
                </div>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th
                        style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          border: '1px solid #e5e7eb',
                          color: '#000000',
                        }}
                      >
                        Meal
                      </th>
                      <th
                        style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          border: '1px solid #e5e7eb',
                          color: '#000000',
                        }}
                      >
                        Adjustment
                      </th>
                      <th
                        style={{
                          padding: '0.75rem',
                          textAlign: 'right',
                          border: '1px solid #e5e7eb',
                          color: '#000000',
                        }}
                      >
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustment.meals
                      .sort((a, b) => a.mealName.localeCompare(b.mealName))
                      .map((meal, mealIdx) => (
                        <tr key={mealIdx}>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #e5e7eb',
                              color: '#000000',
                            }}
                          >
                            {meal.mealName}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              border: '1px solid #e5e7eb',
                              fontStyle: 'italic',
                              color: '#000000',
                            }}
                          >
                            {meal.adjustment}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              border: '1px solid #e5e7eb',
                              fontWeight: 'bold',
                              color: '#000000',
                            }}
                          >
                            {meal.quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
