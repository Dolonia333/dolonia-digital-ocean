import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Database, Shield, Cpu, Network, BarChart3 } from 'lucide-react';

const services = [
  {
    icon: Cloud,
    title: 'Web Development & Hosting',
    description: 'Professional, responsive websites built for your brand with secure hosting solutions.',
    features: ['Custom Website Design', 'UI/UX Design', 'Secure Hosting & Updates', 'Storage Solutions']
  },
  {
    icon: Cpu,
    title: 'AI & Automation',
    description: 'Streamline your business with intelligent automation and AI-enhanced tools.',
    features: ['Custom Automations', 'AI Career Tools', 'Chat Assistants', 'Workflow Integration']
  },
  {
    icon: Shield,
    title: 'IT Infrastructure & Security',
    description: 'Complete technology setup with enterprise-grade security and protection.',
    features: ['Security Audits', 'Business Setup', 'Data Storage', 'System Protection']
  },
  {
    icon: BarChart3,
    title: 'Consulting & Strategy',
    description: 'Expert guidance to help your business grow with strategic planning and development.',
    features: ['Business Plans', 'Pitch Decks', 'Technology Consulting', 'Grant Applications']
  },
  {
    icon: Database,
    title: 'Retainer Packages',
    description: 'Ongoing partnerships for continuous support, maintenance, and growth.',
    features: ['Monthly Support', 'Priority Access', 'Bundled Services', 'Scalable Solutions']
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Modern Technology &</span>
            <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Digital Solutions</span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto leading-relaxed">
            Professional technology, automation, and digital solutions to help your business 
            scale securely and efficiently with expert guidance every step of the way.
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