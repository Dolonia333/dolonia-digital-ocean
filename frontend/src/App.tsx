import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CustomSidebar } from '@/components/CustomSidebar'
import Navigation from '@/components/Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'
import { lazy, Suspense, useEffect, useState } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load all pages for better performance
const Index = lazy(() => import('./pages/Index'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const Government = lazy(() => import('./pages/Government'))
const GovernmentTeaming = lazy(() => import('./pages/GovernmentTeaming'))
const PastPerformance = lazy(() => import('./pages/PastPerformance'))
const CapabilityStatement = lazy(() => import('./pages/CapabilityStatement'))
const Build = lazy(() => import('./pages/Build'))
const ProductSprint = lazy(() => import('./pages/ProductSprint'))
const SupportPlans = lazy(() => import('./pages/SupportPlans'))
const DenizenCaseStudy = lazy(() => import('./pages/DenizenCaseStudy'))
const Denizen = lazy(() => import('./pages/Denizen'))
const Ecosystem = lazy(() => import('./pages/Ecosystem'))
const Iwin = lazy(() => import('./pages/Iwin'))
const SmartContainer = lazy(() => import('./pages/SmartContainer'))
const Engineering = lazy(() => import('./pages/Engineering'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Login = lazy(() => import('./pages/Login'))
const Account = lazy(() => import('./pages/Account'))
const IntakeForm = lazy(() => import('./pages/IntakeForm'))
const TicketSubmission = lazy(() => import('./pages/TicketSubmission'))
const PaymentExample = lazy(() => import('./pages/PaymentExample'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SupabaseConnectionTest = lazy(() => import('./components/SupabaseConnectionTest'))
const Calendar = lazy(() => import('./pages/Calendar'))

const SiteFrame = () => {
  const { pathname } = useLocation()
  const ocean = pathname === '/'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)')
    const closeOnPhone = () => {
      if (phone.matches) setIsSidebarCollapsed(true)
    }
    closeOnPhone()
    phone.addEventListener('change', closeOnPhone)
    return () => phone.removeEventListener('change', closeOnPhone)
  }, [])

  return (
    <div
      className={ocean ? 'h-screen w-screen overflow-hidden' : 'brand-ocean flex min-h-screen w-full flex-col'}
      style={ocean ? undefined : { ['--tools-width' as string]: isSidebarCollapsed ? '4rem' : '16rem' }}
    >
      {ocean ? null : <Navigation />}
      <div className={ocean ? 'h-full' : 'flex min-h-0 w-full flex-1'}>
        <main className={ocean ? 'h-full' : 'min-w-0 flex-1'}>
                <Suspense
                  fallback={
                    pathname === '/login' ? (
                      <div className="ocean-intro" aria-label="Loading experience">
                        <div className="ocean-intro-bg" />
                      </div>
                    ) : (
                      <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
                        <LoadingSpinner size="lg" text="Loading page..." />
                      </div>
                    )
                  }
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/government" element={<Government />} />
                    <Route path="/government/teaming" element={<GovernmentTeaming />} />
                    <Route path="/government/past-performance" element={<PastPerformance />} />
                    <Route path="/capability-statement" element={<CapabilityStatement />} />
                    <Route path="/capability-statement.pdf" element={<CapabilityStatement />} />
                    <Route path="/build" element={<Build />} />
                    <Route path="/build/product-sprint" element={<ProductSprint />} />
                    <Route path="/build/support-plans" element={<SupportPlans />} />
                    <Route path="/work/denizen" element={<DenizenCaseStudy />} />
                    <Route path="/denizen" element={<Denizen />} />
                    <Route path="/ecosystem" element={<Ecosystem />} />
                    <Route path="/ecosystem/iwin" element={<Iwin />} />
                    <Route path="/ecosystem/smartcontainer" element={<SmartContainer />} />
                    <Route path="/engineering" element={<Engineering />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/contact/thank-you" element={<ThankYou />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/services" element={<Navigate to="/build/support-plans" replace />} />
                    <Route path="/pricing" element={<Navigate to="/build/support-plans" replace />} />
                    <Route path="/service-menu" element={<Navigate to="/build/support-plans" replace />} />
                    <Route path="/solutions" element={<Navigate to="/ecosystem" replace />} />
                    <Route path="/security" element={<Navigate to="/government" replace />} />
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
                </Suspense>
        </main>
        {ocean ? null : (
          <CustomSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className=""
          />
        )}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SiteFrame />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
