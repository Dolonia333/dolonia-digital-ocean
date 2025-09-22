import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$99",
      period: "/month",
      description: "Perfect for small teams and startups",
      badge: null,
      features: [
        "Up to 5 team members",
        "100GB cloud storage",
        "Basic security features",
        "Email support",
        "99.9% uptime SLA",
        "Standard backup",
        "Community access"
      ]
    },
    {
      name: "Professional",
      icon: Crown,
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses",
      badge: "Most Popular",
      features: [
        "Up to 25 team members",
        "1TB cloud storage",
        "Advanced security suite",
        "Priority support (24/7)",
        "99.95% uptime SLA",
        "Daily automated backups",
        "Advanced analytics",
        "API access",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      badge: "Contact Us",
      features: [
        "Unlimited team members",
        "Unlimited cloud storage",
        "Military-grade security",
        "Dedicated support manager",
        "99.99% uptime SLA",
        "Real-time backups",
        "Advanced compliance tools",
        "White-label solutions",
        "Custom development",
        "On-premise deployment"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      <BinaryRain />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Simple, Transparent Pricing</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Choose the perfect plan for your business. All plans include our core features with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm hover:bg-ocean-surface/70 transition-all duration-300 ${
                  plan.badge === "Most Popular" ? "border-cyan-bright shadow-glow" : ""
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge 
                      className={`px-4 py-1 ${
                        plan.badge === "Most Popular" 
                          ? "bg-gradient-cyber text-ocean-deep" 
                          : "bg-ocean-surface text-cyan-bright"
                      }`}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-cyber rounded-lg flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-ocean-deep" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-cyan-soft">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-cyan-bright">{plan.price}</span>
                    <span className="text-cyan-soft">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-cyan-bright flex-shrink-0" />
                        <span className="text-cyan-soft">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 transition-all duration-300 ${
                      plan.badge === "Most Popular"
                        ? "bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold"
                        : "bg-transparent border border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep"
                    }`}
                    variant={plan.badge === "Most Popular" ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Can I change plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                    and you'll be billed pro-rata for the difference.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    We offer a 14-day free trial for all plans. No credit card required. 
                    Experience our full feature set before making a commitment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans. 
                    Enterprise customers can also pay via invoice.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Do you offer discounts for annual plans?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    Yes! Save 20% when you pay annually. All annual plans include priority support 
                    and additional security features at no extra cost.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;