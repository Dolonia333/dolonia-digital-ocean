import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Server, Layout, Zap, Check } from 'lucide-react'

const WhatWeDoSection: React.FC = () => {
  const services = [
    {
      title: 'We Host Like AWS — But Easier',
      icon: Server,
      description:
        "Dolonia provides secure, high-speed cloud hosting for your websites, apps, and business tools. You don't need to manage servers or deal with complex platforms — we handle it all for you. Your data stays private, protected, and always online.",
      features: [
        'Fast, secure website and app hosting',
        'Private cloud environments for sensitive data',
        'Daily backups and uptime monitoring',
        'Enterprise-grade protection without enterprise hassle',
      ],
      tagline: 'Your business runs smoothly because your infrastructure is rock solid.',
    },
    {
      title: 'We Build Like Shopify — But Custom',
      icon: Layout,
      description:
        "Dolonia gives you complete control over your online presence. We build and manage websites that are fast, reliable, and built to grow with your brand — whether you're selling products, booking clients, or managing a team online.",
      features: [
        'Custom website design and development',
        'E-commerce stores and online payment setup',
        'Booking systems, client dashboards, and portals',
        'Built-in analytics and SEO optimization',
      ],
      tagline: 'You own your digital space — we make it look good and work flawlessly.',
    },
    {
      title: 'We Automate Like OpenAI — But Personal',
      icon: Zap,
      description:
        'Dolonia integrates intelligent automation and AI tools directly into your business systems. Instead of using disconnected apps, your tools talk to each other — automatically sending data, managing workflows, and learning from your results.',
      features: [
        'Automation that saves hours weekly',
        'Custom AI chatbots and data dashboards',
        'AI reports that drive decisions',
        'Private AI setup (local or cloud-based) so your data stays yours',
      ],
      tagline: 'Your business starts running itself — with your own private AI behind it.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-ocean-surface/20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">What We Do</span>
          </h2>
          <p className="text-xl md:text-2xl text-cyan-soft mb-6 leading-relaxed">
            At Dolonia Data Tech, we design, host, and automate digital systems that help businesses
            run smarter.
          </p>
          <p className="text-lg md:text-xl text-cyan-soft/90 leading-relaxed">
            Think of us as the bridge between <strong className="text-cyan-bright">AWS</strong>,{' '}
            <strong className="text-cyan-bright">Shopify</strong>, and{' '}
            <strong className="text-cyan-bright">OpenAI</strong> — giving you the same power,
            control, and intelligence, but built for real people and real companies.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="bg-ocean-surface/30 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/50 transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-cyber rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-ocean-deep" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-cyan-bright text-center mb-4">
                    {service.title}
                  </CardTitle>
                  <p className="text-base md:text-lg text-cyan-soft leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-cyan-bright mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-cyan-soft">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-cyan-bright/20">
                    <p className="text-sm md:text-base text-cyan-bright font-medium italic">
                      {service.tagline}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-cyan-bright/10 to-purple-500/10 border-2 border-cyan-bright/30 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-cyan-bright mb-6">Our Mission</h3>
              <p className="text-lg md:text-xl text-cyan-soft mb-4 leading-relaxed">
                We believe businesses should{' '}
                <strong className="text-cyan-bright">own their technology</strong>, not rent it from
                big platforms.
              </p>
              <p className="text-lg md:text-xl text-cyan-soft mb-6 leading-relaxed">
                Dolonia builds systems that give you the same reliability and performance as the
                world's biggest tech companies — without the barriers, subscriptions, or risk.
              </p>
              <p className="text-xl md:text-2xl font-semibold bg-gradient-cyber bg-clip-text text-transparent">
                Dolonia Data Tech — Secure. Intelligent. Built for growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default WhatWeDoSection
