'use client'

import React from 'react'

export const AdminStyles: React.FC = () => {
    return (
        <style jsx global>{`
      /* Operations Group - Ensure it stands out or is default */
      .nav-group.Operations {
        /* Default styles usually fine, maybe adding margin to separate from System */
        margin-bottom: 20px;
        border-bottom: 1px solid var(--theme-elevation-200);
        padding-bottom: 10px;
      }
      
      /* System Group - De-emphasize */
      .nav-group.System {
        transform-origin: left top;
        opacity: 0.8;
      }

      .nav-group.System .nav-group__label {
        font-size: 0.85rem;
        color: var(--theme-elevation-500);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nav-group.System .nav__link {
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .nav-group.System .nav__link-label {
        font-size: 0.9rem;
      }
      
      /* Hover effect to bring attention back if needed */
      .nav-group.System:hover {
        opacity: 1;
      }
    `}</style>
    )
}
