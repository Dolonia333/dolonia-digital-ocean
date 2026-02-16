import React from 'react'
import Navigation from '@/components/Navigation'
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
  showNavigation = false, // Hide top navigation - using sidebar only
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground overflow-x-hidden">
      <EngagementListener />
      {/* Main background */}

      {/* Navigation */}
      {showNavigation && <Navigation />}

      {/* Main content with page transition */}
      <PageTransition>
        <main className="relative z-10 overflow-x-hidden">{children}</main>
      </PageTransition>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
