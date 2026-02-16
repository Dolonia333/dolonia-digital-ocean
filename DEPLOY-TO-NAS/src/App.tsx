import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CustomSidebar } from '@/components/CustomSidebar'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useState } from 'react'

// Import ALL pages directly - NO lazy loading to prevent React duplication
import Index from './pages/Index'
import Services from './pages/Services'
import Solutions from './pages/Solutions'
import Security from './pages/Security'
import About from './pages/About'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import ServiceMenu from './pages/ServiceMenu'
import Blog from './pages/Blog'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import Login from './pages/Login'
import Account from './pages/Account'
import IntakeForm from './pages/IntakeForm'
import TicketSubmission from './pages/TicketSubmission'
import PaymentExample from './pages/PaymentExample'
import NotFound from './pages/NotFound'
import SupabaseConnectionTest from './components/SupabaseConnectionTest'
import Calendar from './pages/Calendar'

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex w-full">
              <main className="flex-1 md:ml-0">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/service-menu" element={<ServiceMenu />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/intake" element={<IntakeForm />} />
                  <Route path="/submit-ticket" element={<TicketSubmission />} />
                  <Route path="/payment-example" element={<PaymentExample />} />
                  <Route path="/test-connection" element={<SupabaseConnectionTest />} />
                  <Route path="/calendar" element={<Calendar />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <CustomSidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className=""
              />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
