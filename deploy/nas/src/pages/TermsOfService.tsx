import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TermsOfService = () => {
  return (
    <Layout>
      <SEO
        title="Terms of Service - Dolonia"
        description="Read Dolonia's Terms of Service and understand the conditions for using our cybersecurity solutions."
      />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Please read these terms carefully before using Dolonia's services.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardHeader>
              <CardTitle className="text-foreground">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-cyan-soft">
              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Acceptance of Terms</h3>
                <p>
                  By accessing and using Dolonia's website and services, you accept and agree to be
                  bound by the terms and provision of this agreement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  Service Availability
                </h3>
                <p>
                  We strive to provide reliable and secure cybersecurity solutions. However, we do
                  not guarantee uninterrupted service availability.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  User Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and complete information when required</li>
                  <li>Use our services in compliance with applicable laws and regulations</li>
                  <li>Maintain the confidentiality of any access credentials</li>
                  <li>Report security vulnerabilities responsibly</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  Intellectual Property
                </h3>
                <p>
                  All content, features, and functionality of our services are owned by Dolonia and
                  are protected by intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  Limitation of Liability
                </h3>
                <p>
                  Dolonia shall not be liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use of our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Modifications</h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our
                  services after changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Contact Information</h3>
                <p>
                  For questions about these Terms of Service, please contact us at{' '}
                  <a
                    href="mailto:zion@royalsocietymanagement.com"
                    className="text-cyan-bright hover:underline"
                  >
                    zion@royalsocietymanagement.com
                  </a>
                </p>
              </div>

              <div className="text-sm text-cyan-soft/70">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default TermsOfService
