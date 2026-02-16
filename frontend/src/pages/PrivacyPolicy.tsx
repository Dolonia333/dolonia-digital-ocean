import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PrivacyPolicy = () => {
  return (
    <Layout>
      <SEO
        title="Privacy Policy - Dolonia"
        description="Learn how Dolonia protects your privacy and handles your personal information."
      />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your information.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardHeader>
              <CardTitle className="text-foreground">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-cyan-soft">
              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Contact Information</h3>
                <p>
                  We collect information you provide when contacting us, including your name, email
                  address, company, and message content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  Newsletter Subscriptions
                </h3>
                <p>
                  When you subscribe to our newsletter, we collect your email address to send you
                  updates about our services and industry insights.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Usage Data</h3>
                <p>
                  We may collect information about how you interact with our website to improve our
                  services and user experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">
                  How We Use Your Information
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send you newsletters and updates (with your consent)</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Data Protection</h3>
                <p>
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Contact Us</h3>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicy
