import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import WhatWeDoSection from '@/components/WhatWeDoSection'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Clipboard } from 'lucide-react'

const Services = () => {
  return (
    <Layout>
      <SEO
        title="Our Services - Websites, Automation & Hosting"
        description="Professional WordPress sites, n8n automation workflows, and secure hosting. Productized packages designed for small businesses and growing companies."
        keywords="web development oklahoma, automation services, wordpress hosting, n8n workflows, business automation, okc web design"
      />

      <div className="pt-20">
        <WhatWeDoSection />

        {/* Intake Form CTA */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-ocean-surface/80 to-ocean-deep/60 rounded-2xl border border-cyan-bright/20 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-cyber rounded-xl flex items-center justify-center">
                    <Clipboard className="w-8 h-8 md:w-10 md:h-10 text-ocean-deep" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-cyan-bright mb-3">
                    Ready to Get Started?
                  </h2>
                  <p className="text-cyan-soft text-lg mb-6">
                    Tell us about your project and we'll create a custom solution tailored to your
                    needs across all three divisions.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold group"
                    data-engagement="cta_click"
                    data-cta-type="intake_form"
                    data-cta-location="services_page"
                  >
                    <Link to="/intake" className="flex items-center gap-2">
                      Start Your Intake Form
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Services
