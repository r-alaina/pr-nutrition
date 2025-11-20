'use client'

import React from 'react'

export const ReportButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = '/admin/kitchen-report'
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem',
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#000000',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#333333'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#000000'
        }}
      >
        Download Reports
      </button>
    </div>
  )
}
