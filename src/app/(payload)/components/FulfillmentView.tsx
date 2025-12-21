'use client'

import { useState, useEffect } from 'react'

interface PackingSlipItem {
    mealName: string
    quantity: number
    category: string
}

interface PackingSlip {
    orderNumber: string
    customerName: string
    customerEmail: string
    tierName: string
    weekHalf: string
    status: string
    items: PackingSlipItem[]
    allergies?: string[]
    notes?: string
}

export default function FulfillmentView() {
    const [slips, setSlips] = useState<PackingSlip[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [weekHalf, setWeekHalf] = useState<string>('firstHalf')

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekHalf])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/fulfillment?weekHalf=${weekHalf}`)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setSlips(data)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    const filteredSlips = slips.filter(slip =>
        slip.customerName.toLowerCase().includes(search.toLowerCase()) ||
        slip.orderNumber.toLowerCase().includes(search.toLowerCase())
    )

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fulfillment-page">
            {/* Hide controls when printing */}
            <div className="no-print" style={{ padding: '2rem', paddingBottom: '0.5rem', background: '#f6f6f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ margin: 0 }}>Fulfillment & Packing</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handlePrint}
                            style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Print Packing Slips
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Week Half Toggle */}
                    <div style={{ display: 'flex', background: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ccc' }}>
                        <button
                            onClick={() => setWeekHalf('firstHalf')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: weekHalf === 'firstHalf' ? '#eee' : '#fff',
                                fontWeight: weekHalf === 'firstHalf' ? 'bold' : 'normal',
                                cursor: 'pointer'
                            }}
                        >
                            First Half
                        </button>
                        <button
                            onClick={() => setWeekHalf('secondHalf')}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                background: weekHalf === 'secondHalf' ? '#eee' : '#fff',
                                fontWeight: weekHalf === 'secondHalf' ? 'bold' : 'normal',
                                cursor: 'pointer',
                                borderLeft: '1px solid #ccc'
                            }}
                        >
                            Second Half
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '300px' }}
                    />
                </div>
            </div>

            <div style={{ padding: '2rem' }}>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="slip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {filteredSlips.map(slip => (
                        <div key={slip.orderNumber} className="packing-slip" style={{
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            border: '1px solid #eee'
                        }}>
                            <div style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{slip.customerName}</h2>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                    <span>{slip.tierName}</span>
                                    <span>{slip.orderNumber}</span>
                                </div>
                            </div>

                            {slip.allergies && slip.allergies.length > 0 && (
                                <div style={{ background: '#ffebeb', padding: '10px', borderRadius: '4px', marginBottom: '15px', color: '#d00', fontWeight: 'bold' }}>
                                    Allergies: {slip.allergies.join(', ')}
                                </div>
                            )}

                            {slip.notes && (
                                <div style={{ background: '#fff8e1', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                    Note: {slip.notes}
                                </div>
                            )}

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #eee' }}>
                                        <th style={{ textAlign: 'left', padding: '5px' }}>Item</th>
                                        <th style={{ textAlign: 'right', padding: '5px', width: '50px' }}>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slip.items.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                            <td style={{ padding: '8px 5px' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.mealName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.category}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '8px 5px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                {item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                                {slip.weekHalf === 'firstHalf' ? 'First Half (Sun/Mon)' : 'Second Half (Wed/Thu)'} Pickup
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @media print {
          /* Hide non-printable elements */
          .no-print, nav, header, aside, .nav__wrap, .app-header {
            display: none !important;
          }
          
          /* Reset page layout */
          body, html, .fulfillment-page, .slip-grid {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Force grid to block for printing */
          .slip-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 15px !important;
          }

          /* Compact slip styles */
          .packing-slip {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #000 !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            padding: 10px !important;
            font-size: 0.9rem !important;
          }

          /* Hide page break after each slip, let the grid flow */
          .packing-slip {
            page-break-after: auto !important;
          }

          /* Ensure headers and text are compact */
          .packing-slip h2 {
            font-size: 1.1rem !important;
            margin-bottom: 2px !important;
          }
          
          .packing-slip td {
            padding: 2px 5px !important;
          }
        }
      `}</style>
        </div>
    )
}
