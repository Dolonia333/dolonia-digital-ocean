import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Cpu, Shield, BarChart3, Headphones } from 'lucide-react';

const serviceCategories = [
  {
    icon: Cloud,
    title: 'Web Development & Hosting',
    description: 'Professional websites and secure hosting solutions',
    services: [
      {
        name: 'Custom Website Design & Development',
        description: 'Professional, responsive websites built for your brand with a focus on user experience and performance.',
        pricing: [
          { tier: 'Starter', price: '$1,500 – $2,500' },
          { tier: 'Business', price: '$3,500 – $5,000' },
          { tier: 'Advanced', price: '$7,500+', note: 'custom integrations, dashboards, client portals' }
        ]
      },
      {
        name: 'Web Design & UI/UX',
        description: 'Clean, modern designs that improve user experience and drive engagement.',
        pricing: [
          { tier: 'Standard', price: '$1,000 – $3,500', note: 'depending on scope' }
        ]
      },
      {
        name: 'Web Hosting & Storage Services',
        description: 'Secure hosting solutions with built-in storage and regular updates to keep your website running smoothly.',
        pricing: [
          { tier: 'Hosting Only', price: '$50 – $100/month' },
          { tier: 'Full Service', price: '$250 – $500/month', note: 'hosting + security + updates' }
        ]
      }
    ]
  },
  {
    icon: Cpu,
    title: 'AI & Automation',
    description: 'Intelligent automation and AI-enhanced business tools',
    services: [
      {
        name: 'Custom Automations',
        description: 'Streamline repetitive tasks such as emails, client intake, and data management with automated systems.',
        pricing: [
          { tier: 'Basic', price: '$1,000 – $2,000' },
          { tier: 'Advanced', price: '$3,500 – $7,500', note: 'complex workflows' },
          { tier: 'Enterprise', price: '$10,000+', note: 'full business suite' }
        ]
      },
      {
        name: 'AI-Enhanced Career Tools',
        description: 'Professional resumes, cover letters, and job application support powered by advanced AI tools.',
        pricing: [
          { tier: 'Resume/Cover Letter', price: '$75 – $150' },
          { tier: 'Full Package', price: '$250 – $500', note: 'complete application support' }
        ]
      },
      {
        name: 'Intelligent Chat Assistants',
        description: 'Custom chat assistants for websites or community platforms to help with customer support and engagement.',
        pricing: [
          { tier: 'Basic', price: '$2,500 – $5,000' },
          { tier: 'Advanced', price: '$7,500 – $12,000', note: 'complex integrations' }
        ]
      }
    ]
  },
  {
    icon: Shield,
    title: 'IT Infrastructure & Security',
    description: 'Complete technology setup and enterprise security',
    services: [
      {
        name: 'Business Hosting & Storage Setup',
        description: 'Mini-database systems that give your business private hosting, data storage, and secure access.',
        pricing: [
          { tier: 'Setup', price: '$2,000 – $5,000', note: 'one-time configuration' },
          { tier: 'Maintenance', price: '$250 – $750/month', note: 'ongoing support' }
        ]
      },
      {
        name: 'Security Audits & Protection',
        description: 'Comprehensive audits to find weaknesses in your system and provide solutions for stronger protection.',
        pricing: [
          { tier: 'Basic Audit', price: '$750 – $1,500' },
          { tier: 'Full Security Package', price: '$3,500 – $7,500' }
        ]
      },
      {
        name: 'Business Technology Setup',
        description: 'Complete setup for offices or teams, including networking, devices, and secure systems to keep operations running smoothly.',
        pricing: [
          { tier: 'Small Business', price: '$1,500 – $3,500' },
          { tier: 'Enterprise', price: '$10,000+', note: 'comprehensive deployment' }
        ]
      }
    ]
  },
  {
    icon: BarChart3,
    title: 'Consulting & Strategy',
    description: 'Expert business guidance and strategic planning',
    services: [
      {
        name: 'Business Plan Development',
        description: 'Professional business plans tailored for SBA requirements, grants, and investors.',
        pricing: [
          { tier: 'Basic', price: '$1,500 – $2,500' },
          { tier: 'Advanced', price: '$3,500 – $5,000', note: 'investor/grant level' }
        ]
      },
      {
        name: 'Pitch Deck Creation',
        description: 'Polished, professional pitch decks that help secure funding and partnerships.',
        pricing: [
          { tier: 'Standard', price: '$1,000 – $2,500' },
          { tier: 'Investor-Grade', price: '$3,500 – $5,000' }
        ]
      },
      {
        name: 'Technology & Automation Consulting',
        description: 'Guidance on how to integrate digital systems, automation, and secure technology into your business.',
        pricing: [
          { tier: 'Hourly', price: '$150 – $250/hr' },
          { tier: 'Package', price: 'Custom rates available' }
        ]
      }
    ]
  }
];

const DetailedServicesSection: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Complete</span>
            <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Service Menu</span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto leading-relaxed">
            Comprehensive pricing for all our technology, automation, and digital solutions. 
            All services can be bundled or included in retainer packages.
          </p>
        </div>

        {/* Service categories */}
        <div className="space-y-16">
          {serviceCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex} className="space-y-8">
                {/* Category header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-gradient-cyber rounded-lg cyber-glow">
                    <Icon className="h-8 w-8 text-ocean-deep" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">{category.title}</h3>
                    <p className="text-lg text-cyan-soft">{category.description}</p>
                  </div>
                </div>

                {/* Services in category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <Card 
                      key={serviceIndex}
                      className="bg-ocean-surface/30 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/50 transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground">{service.name}</CardTitle>
                        <CardDescription className="text-cyan-soft leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {service.pricing.map((pricing, pricingIndex) => (
                            <div key={pricingIndex} className="flex items-center justify-between p-3 bg-ocean-surface/40 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-cyan-bright border-cyan-bright/50">
                                  {pricing.tier}
                                </Badge>
                                {pricing.note && (
                                  <span className="text-sm text-cyan-soft">({pricing.note})</span>
                                )}
                              </div>
                              <span className="font-semibold text-cyan-bright">{pricing.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-cyber/10 border-cyan-bright/30 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-cyber rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-ocean-deep" />
              </div>
              <CardTitle className="text-2xl text-foreground">Ready to Get Started?</CardTitle>
              <CardDescription className="text-cyan-soft text-lg">
                Contact us for a free consultation and custom quote tailored to your business needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold px-8">
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep px-8">
                  Get Custom Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DetailedServicesSection;