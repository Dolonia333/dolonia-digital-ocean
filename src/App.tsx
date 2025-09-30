import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CustomSidebar } from "@/components/CustomSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense, useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Security = lazy(() => import("./pages/Security"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ServiceMenu = lazy(() => import("./pages/ServiceMenu"));
const Blog = lazy(() => import("./pages/Blog"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex w-full">
              <main className="flex-1 md:ml-0">
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading page..." />
                    </div>
                  }
                >
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
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
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
  );
};

export default App;
