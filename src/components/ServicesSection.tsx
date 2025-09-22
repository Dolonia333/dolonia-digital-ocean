import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Database, Shield, Cpu, Network, BarChart3 } from 'lucide-react';

const services = [
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Scalable, resilient cloud architecture that grows with your business needs.',
    features: ['Auto-scaling', 'Load balancing', 'Global CDN', '99.99% uptime']
  },
  {
    icon: Database,
    title: 'Data Management',
    description: 'Advanced data solutions with real-time analytics and intelligent insights.',
    features: ['Real-time sync', 'Advanced analytics', 'Data lakes', 'ML integration']
  },
  {
    icon: Shield,
    title: 'Security Suite',
    description: 'Enterprise-grade security with zero-trust architecture and threat detection.',
    features: ['Zero-trust model', 'AI threat detection', 'Compliance ready', 'Encrypted storage']
  },
  {
    icon: Cpu,
    title: 'Edge Computing',
    description: 'Ultra-low latency processing at the edge with intelligent workload distribution.',
    features: ['Sub-10ms latency', 'Edge AI', 'Smart routing', 'Global presence']
  },
  {
    icon: Network,
    title: 'API Gateway',
    description: 'Unified API management with intelligent routing and advanced analytics.',
    features: ['Rate limiting', 'API versioning', 'Real-time monitoring', 'Developer portal']
  },
  {
    icon: BarChart3,
    title: 'Analytics Engine',
    description: 'Powerful analytics platform with predictive insights and custom dashboards.',
    features: ['Predictive analytics', 'Custom dashboards', 'Real-time alerts', 'ML workflows']
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Comprehensive</span>
            <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Cloud Solutions</span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto leading-relaxed">
            Everything you need to build, deploy, and scale your applications with confidence. 
            Our integrated platform delivers enterprise-grade capabilities with developer-friendly simplicity.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/50 transition-all duration-300 group hover:shadow-cyber"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-cyber rounded-lg cyber-glow group-hover:shadow-glow transition-all duration-300">
                      <Icon className="h-6 w-6 text-ocean-deep" />
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:text-cyan-bright transition-colors">
                      {service.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-cyan-soft leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-cyan-bright rounded-full" />
                        <span className="text-cyan-soft text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;