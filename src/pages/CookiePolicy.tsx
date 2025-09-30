import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <Layout>
      <SEO 
        title="Cookie Policy - Dolonia"
        description="Learn about how Dolonia uses cookies to improve your experience on our website."
      />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              This policy explains how we use cookies and similar technologies on our website.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
            <CardHeader>
              <CardTitle className="text-foreground">What Are Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-cyan-soft">
              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Definition</h3>
                <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving website functionality.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Types of Cookies We Use</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-cyan-bright">Essential Cookies</h4>
                    <p className="text-sm">Required for basic website functionality and security.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cyan-bright">Performance Cookies</h4>
                    <p className="text-sm">Help us understand how visitors interact with our website.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-cyan-bright">Functional Cookies</h4>
                    <p className="text-sm">Remember your preferences and provide enhanced features.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">How We Use Cookies</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>To ensure website security and prevent fraud</li>
                  <li>To remember your preferences and settings</li>
                  <li>To analyze website performance and usage patterns</li>
                  <li>To provide personalized content and recommendations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Managing Cookies</h3>
                <p>You can control and manage cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Third-Party Cookies</h3>
                <p>We may use third-party services that set their own cookies. These are governed by the respective third parties' privacy policies.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Updates to This Policy</h3>
                <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-bright mb-2">Contact Us</h3>
                <p>If you have questions about our Cookie Policy, please contact us at <a href="mailto:zion@royalsocietymanagement.com" className="text-cyan-bright hover:underline">zion@royalsocietymanagement.com</a></p>
              </div>

              <div className="text-sm text-cyan-soft/70">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;