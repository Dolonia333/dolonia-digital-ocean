import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Rocket, TrendingUp, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ServicePackage {
  name: string
  icon: React.ReactNode
  price: string
  description: string
  badge?: string
  features: string[]
  idealFor?: string
  highlighted?: boolean
}

const packages: ServicePackage[] = [
  {
    name: 'Starter Infrastructure',
    icon: <Rocket className="h-8 w-8 text-cyan-bright" />,
    price: '$500/month',
    description: 'Built for small businesses that want a reliable online foundation.',
    idealFor: 'Entrepreneurs, freelancers, or local businesses getting started online.',
    features: [
      'Secure website hosting (WordPress or Next.js)',
      'Domain + SSL certificate setup',
      '2 automation workflows to save time',
      'Basic SEO and performance optimization',
      'Monthly maintenance and updates',
      'Email support included',
    ],
  },
  {
    name: 'Automation Growth',
    icon: <TrendingUp className="h-8 w-8 text-cyan-bright" />,
    price: '$1,200/month',
    description: 'Designed for growing brands ready to automate and scale.',
    badge: 'Most Popular',
    highlighted: true,
    idealFor: 'Small teams or creative agencies looking to save time and improve performance.',
    features: [
      'Custom website or app design',
      'Up to 5 automation workflows (AI-powered)',
      'Secure hosting with Cloudflare optimization',
      'Supabase database and analytics dashboard',
      'Weekly performance monitoring',
      'Advanced SEO and site optimization',
      'Priority technical support',
    ],
  },
  {
    name: 'Secure Data Systems',
    icon: <Shield className="h-8 w-8 text-cyan-bright" />,
    price: 'Custom Pricing',
    description: 'Enterprise-grade infrastructure built for security, privacy, and scalability.',
    idealFor:
      'Established companies, organizations, or government teams that require advanced data protection and automation.',
    features: [
      'Dedicated NAS storage and private cloud setup',
      'Cloudflare Zero-Trust access control',
      'Automated off-site backups',
      'Docker-based container infrastructure',
      '24/7 monitoring and dedicated engineer support',
      'Compliance-ready (HIPAA / SOC-2) configurations',
      'White-glove onboarding and service',
    ],
  },
]

const ServicePackages: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-b from-background to-ocean-surface/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Simple Plans. Powerful Infrastructure.
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            No hidden fees. No surprise charges. Just secure, high-performance technology that grows
            with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative ${
                pkg.highlighted
                  ? 'border-cyan-bright shadow-lg shadow-cyan-bright/20 scale-105'
                  : 'border-ocean-surface'
              } bg-ocean-surface/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-cyan-bright text-background font-semibold px-4 py-1">
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{pkg.icon}</div>
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                <CardDescription className="text-cyan-soft">{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-cyan-bright mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-cyan-soft">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.idealFor && (
                  <div className="mb-6 p-3 bg-ocean-surface/50 rounded-lg border border-cyan-bright/20">
                    <p className="text-sm text-cyan-soft">
                      <span className="font-semibold text-cyan-bright">Ideal for:</span>{' '}
                      {pkg.idealFor}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-cyan-bright hover:bg-cyan-bright/90 text-background font-semibold"
                  onClick={() => navigate('/contact')}
                  data-engagement="cta_service_package"
                  data-engagement-package={pkg.name}
                  data-engagement-category="cta"
                  data-engagement-label={`package:${pkg.name}`}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-cyan-soft mb-4">
            Need something different? Schedule a <strong>consultation</strong> and we'll tailor
            Dolonia's technology to fit your business.
          </p>
          <Button
            variant="outline"
            className="border-cyan-bright text-cyan-bright hover:bg-cyan-bright/10"
            onClick={() => navigate('/contact')}
            data-engagement="cta_schedule_consultation"
            data-engagement-category="cta"
            data-engagement-label="footer_schedule_consultation"
          >
            Schedule a Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicePackages
