import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Zero-Trust Architecture',
      description: 'Every request is verified, every connection is secured, every access is monitored.'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'Military-grade encryption protecting your data in transit, at rest, and in processing.'
    },
    {
      icon: Eye,
      title: 'AI Threat Detection',
      description: 'Advanced machine learning algorithms detect and neutralize threats in real-time.'
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Automated incident response and recovery systems minimize downtime and risk.'
    }
  ];

  const complianceStandards = [
    'SOC 2 Type II',
    'ISO 27001',
    'GDPR Compliant',
    'HIPAA Ready',
    'PCI DSS',
    'FedRAMP'
  ];

  return (
    <section id="security" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-ocean-surface/50 backdrop-blur-sm border border-cyan-bright/30 rounded-full px-4 py-2 mb-6 cyber-glow">
            <Shield size={16} className="text-cyan-bright" />
            <span className="text-cyan-soft text-sm font-medium">Enterprise Security</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Uncompromising</span>
            <br />
            <span className="bg-gradient-cyber bg-clip-text text-transparent">Security First</span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto leading-relaxed">
            Your data deserves the highest level of protection. Our security-first approach 
            ensures your applications and information remain safe from evolving threats.
          </p>
        </div>

        {/* Main security showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left side - Security features */}
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-ocean-surface/30 backdrop-blur-sm rounded-lg border border-ocean-surface hover:border-cyan-bright/50 transition-all duration-300 group"
                >
                  <div className="p-3 bg-gradient-cyber rounded-lg cyber-glow group-hover:shadow-glow transition-all duration-300 flex-shrink-0">
                    <Icon className="h-6 w-6 text-ocean-deep" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-cyan-bright transition-colors mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-cyan-soft leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side - Security stats and compliance */}
          <div className="space-y-8">
            <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-cyan-bright" />
                  <span>Security Metrics</span>
                </CardTitle>
                <CardDescription className="text-cyan-soft">
                  Real-time security performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-2">
                      99.9%
                    </div>
                    <div className="text-sm text-cyan-soft">Threat Detection Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-2">
                      &lt;1ms
                    </div>
                    <div className="text-sm text-cyan-soft">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-2">
                      24/7
                    </div>
                    <div className="text-sm text-cyan-soft">Security Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-2">
                      Zero
                    </div>
                    <div className="text-sm text-cyan-soft">Data Breaches</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Compliance Standards</CardTitle>
                <CardDescription className="text-cyan-soft">
                  Meeting the highest industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {complianceStandards.map((standard, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-cyan-bright" />
                      <span className="text-cyan-soft text-sm">{standard}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-surface rounded-2xl p-8 border border-ocean-surface cyber-glow">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Secure Your Future?
            </h3>
            <p className="text-cyan-soft mb-6 max-w-2xl mx-auto">
              Join thousands of enterprises who trust Dolonia.cloud with their most critical applications and sensitive data.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold px-8 py-4 text-lg transition-all duration-300 group"
            >
              Start Security Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;