import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Rocket, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServicePackage {
  name: string;
  icon: React.ReactNode;
  price: string;
  description: string;
  badge?: string;
  features: string[];
  highlighted?: boolean;
}

const packages: ServicePackage[] = [
  {
    name: "Starter Package",
    icon: <Rocket className="h-8 w-8 text-cyan-bright" />,
    price: "$500/month",
    description: "Perfect for small businesses getting online",
    features: [
      "Professional WordPress site",
      "Secure hosting included",
      "2 automation workflows",
      "Basic SEO setup",
      "Monthly maintenance",
      "Email support"
    ]
  },
  {
    name: "Business Growth",
    icon: <TrendingUp className="h-8 w-8 text-cyan-bright" />,
    price: "$1,200/month",
    description: "Scale your operations with automation",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Custom site design",
      "Priority hosting",
      "5 automation workflows",
      "AI-powered tools",
      "Advanced SEO",
      "Weekly updates",
      "Priority support"
    ]
  },
  {
    name: "Secure Data Package",
    icon: <Shield className="h-8 w-8 text-cyan-bright" />,
    price: "Custom",
    description: "Enterprise-grade security and infrastructure",
    features: [
      "Dedicated NAS storage",
      "Cloudflare Access control",
      "Automated backups",
      "Docker containerization",
      "24/7 monitoring",
      "Compliance ready",
      "White-glove support"
    ]
  }
];

const ServicePackages: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-background to-ocean-surface/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Clear Packages, Predictable Pricing
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            No hidden fees. No surprises. Just straightforward monthly retainers that cover everything you need.
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
                <div className="flex justify-center mb-4">
                  {pkg.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-cyan-bright mb-2">
                  {pkg.price}
                </div>
                <CardDescription className="text-cyan-soft">
                  {pkg.description}
                </CardDescription>
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

                <Button 
                  className="w-full bg-cyan-bright hover:bg-cyan-bright/90 text-background font-semibold"
                  onClick={() => navigate('/contact')}
                  data-engagement="cta_service_package"
                  data-engagement-package={pkg.name}
                  data-engagement-category="cta"
                  data-engagement-label={`package:${pkg.name}`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-cyan-soft mb-4">
            Need something custom? Have a bigger project in mind?
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
  );
};

export default ServicePackages;
