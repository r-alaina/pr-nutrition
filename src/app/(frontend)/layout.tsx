import { ReactNode } from 'react'
import '../globals.css'

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
