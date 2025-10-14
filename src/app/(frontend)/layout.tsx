import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '../globals.css'
import './styles.css'

export const metadata: Metadata = {
  title: 'Payload Blank Template',
}

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}

export default Layout
