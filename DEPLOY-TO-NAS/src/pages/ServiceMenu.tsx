import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, MapPin, Globe, Download, FileText, MessageCircle } from 'lucide-react'
import doloniaLogo from '@/assets/dolonia-logo.png'

const ServiceMenu = () => {
  const businessInfo = {
    name: 'Dolonia Data Tech',
    email: 'zion@royalsocietymanagement.com',
    website: 'Dolonia.cloud',
    address: '600 N. Robinson Ave, 6th Floor, Office #680, Oklahoma City, OK 73102',
  }

  const handleDownload = () => {
    const content = `DOLONIA DATA TECH - SERVICE MENU 2025

Contact Information:
• Email: ${businessInfo.email}
• Website: ${businessInfo.website}
• Address: ${businessInfo.address}

SERVICE PACKAGES AVAILABLE
- Automation & Workflow Solutions
- Security & Compliance Services
- Cloud & Infrastructure Management
- Development & Integration Services

For detailed pricing and service descriptions, please contact us directly.`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dolonia-services-menu-2025.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <SEO
        title="Service Menu & Pricing 2025 - Dolonia Data Tech"
        description="Complete service menu with pricing for automation, security audits, cloud migration, API development, and retainer packages. Download our 2025 pricing guide."
        keywords="dolonia services menu 2025, technology services pricing, automation setup, security audit, cloud migration, API development, retainer packages"
        url="https://dolonia.cloud/service-menu"
      />
      <Layout>
        <div className="container mx-auto px-6 py-16">
          {/* Header with Business Info */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img src={doloniaLogo} alt="Dolonia Logo" className="w-24 h-24 md:w-32 md:h-32" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Dolonia Data Tech
              </span>
            </h1>
            <p className="text-2xl text-cyan-bright mb-4">Services & Pricing Menu (2025)</p>

            {/* Business Contact Card */}
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm max-w-2xl mx-auto mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">{businessInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">Live chat available on every page</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">{businessInfo.website}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-cyan-bright mt-1" />
                    <span className="text-foreground text-sm">{businessInfo.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleDownload}
              className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold mb-8"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Service Menu
            </Button>
          </div>

          {/* Service Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Automation & Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft mb-4">
                  Streamline operations with intelligent automation solutions.
                </p>
                <ul className="text-cyan-soft space-y-2">
                  <li>• Process Automation Setup</li>
                  <li>• Database Management</li>
                  <li>• Workflow Optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft mb-4">
                  Enterprise-grade security and compliance solutions.
                </p>
                <ul className="text-cyan-soft space-y-2">
                  <li>• Security Audits</li>
                  <li>• GDPR/HIPAA Compliance</li>
                  <li>• Threat Monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Cloud & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft mb-4">
                  Scalable cloud solutions and infrastructure management.
                </p>
                <ul className="text-cyan-soft space-y-2">
                  <li>• Cloud Migration</li>
                  <li>• Infrastructure Monitoring</li>
                  <li>• Performance Optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Development & Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft mb-4">
                  Custom development and system integration services.
                </p>
                <ul className="text-cyan-soft space-y-2">
                  <li>• API Development</li>
                  <li>• System Integration</li>
                  <li>• Custom Applications</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Retainer Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Monthly Retainer Packages
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Startup Accelerator</CardTitle>
                  <div className="text-3xl font-bold text-cyan-bright">$2,500/month</div>
                  <CardDescription className="text-cyan-soft">
                    Perfect for growing startups needing foundational tech infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">20 hours of development time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">Basic security audit</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">Cloud setup and optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Business Growth</CardTitle>
                  <div className="text-3xl font-bold text-cyan-bright">$5,000/month</div>
                  <CardDescription className="text-cyan-soft">
                    Ideal for established businesses scaling their operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">40 hours of development time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">Advanced security implementation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">Process automation setup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Enterprise Solutions</CardTitle>
                  <div className="text-3xl font-bold text-cyan-bright">$10,000/month</div>
                  <CardDescription className="text-cyan-soft">
                    Comprehensive solution for large organizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">80 hours of development time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">Full compliance management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-cyan-soft">24/7 priority support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center justify-center">
                <FileText className="w-6 h-6 mr-2 text-cyan-bright" />
                Contact for Detailed Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-cyan-soft mb-6">
                For detailed service descriptions and custom pricing based on your specific needs,
                please contact us directly. We provide tailored solutions for every business size
                and industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  className="bg-gradient-cyber hover:shadow-glow transition-all duration-300"
                >
                  <a href={`mailto:${businessInfo.email}`} className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Us</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-cyan-bright text-cyan-bright hover:bg-cyan-bright/10"
                >
                  <a href="/contact" className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Request a Consultation</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  )
}

export default ServiceMenu
