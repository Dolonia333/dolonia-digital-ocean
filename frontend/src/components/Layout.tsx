import React from 'react'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import EngagementListener from '@/components/EngagementListener'

interface LayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
  showFooter?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <EngagementListener />
      {/* Main background */}

      <PageTransition>
        <main className="relative z-10">
          {children}
        </main>
      </PageTransition>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
