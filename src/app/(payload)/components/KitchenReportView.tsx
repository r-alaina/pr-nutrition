'use client'

import { useState, useEffect, useRef } from 'react'

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekHalf])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ margin: 0, color: '#000000' }}>Kitchen Order Report</h1>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: '500', fontSize: '1rem', color: '#000000' }}>
              Week Half:
            </span>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  padding: '0.5rem 2.5rem 0.5rem 0.875rem',
                  color: '#1f2937',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.15s ease-in-out',
                  minWidth: '140px',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#9ca3af'
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#5CB85C'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(92, 184, 92, 0.1)'
                }}
                onBlur={(e) => {
                  if (!isDropdownOpen) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                <span>{weekHalf === 'firstHalf' ? 'First Half' : 'Second Half'}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: '#6b7280',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path
                    d="M3.5 5.25L7 8.75L10.5 5.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.25rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    boxShadow:
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    minWidth: '140px',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => {
                      setWeekHalf('firstHalf')
                      setIsDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      textAlign: 'left',
                      color: weekHalf === 'firstHalf' ? '#5CB85C' : '#1f2937',
                      backgroundColor: weekHalf === 'firstHalf' ? '#f0fdf4' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                      fontWeight: weekHalf === 'firstHalf' ? '600' : '500',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      if (weekHalf !== 'firstHalf') {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (weekHalf !== 'firstHalf') {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {weekHalf === 'firstHalf' && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: '#5CB85C', flexShrink: 0 }}
                      >
                        <path
                          d="M13.333 4L6 11.333 2.667 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <span>First Half</span>
                  </button>
                  <button
                    onClick={() => {
                      setWeekHalf('secondHalf')
                      setIsDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      textAlign: 'left',
                      color: weekHalf === 'secondHalf' ? '#5CB85C' : '#1f2937',
                      backgroundColor: weekHalf === 'secondHalf' ? '#f0fdf4' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                      fontWeight: weekHalf === 'secondHalf' ? '600' : '500',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderTop: '1px solid #e5e7eb',
                    }}
                    onMouseEnter={(e) => {
                      if (weekHalf !== 'secondHalf') {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (weekHalf !== 'secondHalf') {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {weekHalf === 'secondHalf' && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: '#5CB85C', flexShrink: 0 }}
                      >
                        <path
                          d="M13.333 4L6 11.333 2.667 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <span>Second Half</span>
                  </button>
                </div>
              )}
            </div>
          </div>
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
              overflowY: 'auto',
              maxHeight: '70vh',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #e5e7eb',
                      color: '#000000',
                      backgroundColor: '#f3f4f6',
                      fontWeight: 'bold',
                    }}
                  >
                    Meal
                  </th>
                  {report.tierAggregations.map((tier) => (
                    <th
                      key={tier.tierId}
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        border: '1px solid #e5e7eb',
                        color: '#000000',
                        backgroundColor: '#f3f4f6',
                        fontWeight: 'bold',
                      }}
                    >
                      {tier.tierName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allMeals.map((meal) => {
                  return (
                    <tr key={meal}>
                      <td
                        style={{
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          color: '#000000',
                          fontWeight: 'bold',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {meal}
                      </td>
                      {report.tierAggregations.map((tier) => {
                        const mealMap = tierMealMap.get(tier.tierName) || new Map()
                        const quantity = mealMap.get(meal) || 0
                        return (
                          <td
                            key={tier.tierId}
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              border: '1px solid #e5e7eb',
                              color: '#000000',
                              backgroundColor: '#ffffff',
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
