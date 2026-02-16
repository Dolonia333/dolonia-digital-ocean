import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import RetainerCalculator from '@/components/RetainerCalculator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Database, Shield, Zap, Globe, Cpu } from 'lucide-react'

const Solutions = () => {
  const solutions = [
    {
      icon: Cloud,
      title: 'Multi-Cloud Architecture',
      description: 'Seamlessly deploy across AWS, Azure, and Google Cloud with unified management.',
    },
    {
      icon: Database,
      title: 'Data Lake Solutions',
      description:
        'Store, process, and analyze massive datasets with our scalable data lake platform.',
    },
    {
      icon: Shield,
      title: 'Zero-Trust Security',
      description: 'Comprehensive security framework with identity-based access controls.',
    },
    {
      icon: Zap,
      title: 'Edge Computing',
      description: 'Reduce latency with our global edge network and intelligent caching.',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Lightning-fast content delivery with our worldwide network infrastructure.',
    },
    {
      icon: Cpu,
      title: 'AI/ML Platform',
      description: 'Build, train, and deploy machine learning models at enterprise scale.',
    },
  ]

  return (
    <Layout>
      <SEO
        title="Enterprise Solutions - Advanced Cloud & Security Solutions"
        description="Industry-leading solutions tailored for modern enterprises seeking digital excellence. Multi-cloud architecture, zero-trust security, and AI/ML platforms."
        keywords="enterprise solutions, multi-cloud architecture, zero trust security, AI ML platform, edge computing, global CDN"
      />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Enterprise Solutions
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Industry-leading solutions tailored for modern enterprises seeking digital excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className={`bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm hover-lift group fade-in stagger-${Math.min(index + 1, 5)}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                    <solution.icon className="w-6 h-6 text-ocean-deep" />
                  </div>
                  <CardTitle className="text-foreground">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-cyan-soft">
                    {solution.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <RetainerCalculator />
      </div>
    </Layout>
  )
}

export default Solutions
