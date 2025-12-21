'use client'

import React from 'react'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export const LogoutButton: React.FC = () => {
    return (
        <div className="nav-group">
            <Link href="/admin/logout" className="nav-link logout-link">
                <LogOut size={20} style={{ marginRight: '10px' }} />
                Log out
            </Link>
            <style jsx>{`
        .logout-link {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          color: var(--theme-elevation-800);
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.1s ease;
          border-radius: 4px;
          margin: 5px 10px;
        }
        .logout-link:hover {
          background-color: var(--theme-elevation-100);
          color: var(--theme-elevation-900);
        }
        /* Dark mode compatibility if needed, using payload vars */
        :global([data-theme='dark']) .logout-link {
            color: var(--theme-elevation-150);
        }
        :global([data-theme='dark']) .logout-link:hover {
            background-color: var(--theme-elevation-700);
            color: var(--theme-elevation-50);
        }
      `}</style>
        </div>
    )
}
