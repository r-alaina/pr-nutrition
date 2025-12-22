'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type OrderTabsProps = {
    counts: {
        pending: number
        confirmed: number
        completed: number
        cancelled: number
        total: number
    }
}

export default function OrderTabs({ counts }: OrderTabsProps) {
    const searchParams = useSearchParams()
    const currentStatus = searchParams.get('where[status][equals]')

    const tabs = [
        {
            label: 'All Orders',
            status: null,
            count: counts.total,
            baseColor: '#f3f4f6', // gray-100
            textColor: '#1f2937', // gray-800
            activeBg: '#1f2937', // gray-800
            activeText: '#ffffff',
        },
        {
            label: 'Pending',
            status: 'pending',
            count: counts.pending,
            baseColor: '#fef9c3', // yellow-100
            textColor: '#854d0e', // yellow-800
            activeBg: '#eab308', // yellow-500
            activeText: '#ffffff',
        },
        {
            label: 'Confirmed',
            status: 'confirmed',
            count: counts.confirmed,
            baseColor: '#dbeafe', // blue-100
            textColor: '#1e40af', // blue-800
            activeBg: '#3b82f6', // blue-500
            activeText: '#ffffff',
        },
        {
            label: 'Completed',
            status: 'completed',
            count: counts.completed,
            baseColor: '#dcfce7', // green-100
            textColor: '#166534', // green-800
            activeBg: '#16a34a', // green-600
            activeText: '#ffffff',
        },
        {
            label: 'Cancelled',
            status: 'cancelled',
            count: counts.cancelled,
            baseColor: '#fee2e2', // red-100
            textColor: '#991b1b', // red-800
            activeBg: '#ef4444', // red-500
            activeText: '#ffffff',
        },
    ]

    return (
        <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: 'var(--theme-elevation-50)',
            borderRadius: '0.5rem',
            border: '1px solid var(--theme-elevation-100)'
        }}>
            <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'var(--theme-text)'
            }}>
                Order Dashboard
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tabs.map((tab) => {
                    const isActive =
                        tab.status === null
                            ? !currentStatus
                            : currentStatus === tab.status

                    const href = tab.status
                        ? `?where[status][equals]=${tab.status}`
                        : '?'

                    return (
                        <Link
                            key={tab.label}
                            href={href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textDecoration: 'none',
                                minWidth: '140px',
                                transition: 'all 0.2s',
                                backgroundColor: isActive ? tab.activeBg : tab.baseColor,
                                color: isActive ? tab.activeText : tab.textColor,
                                border: isActive ? '1px solid transparent' : '1px solid #e5e7eb',
                            }}
                        >
                            <span>{tab.label}</span>
                            <span
                                style={{
                                    marginLeft: '0.75rem',
                                    padding: '0.125rem 0.625rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                                    color: 'inherit',
                                }}
                            >
                                {tab.count}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
