import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building, TrendingUp, Rocket } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter Package",
      icon: TrendingUp,
      price: "$500",
      period: "/month",
      description: "Perfect for small businesses getting online",
      badge: "Best Value",
      features: [
        "Professional WordPress site",
        "Secure hosting included",
        "2 automation workflows",
        "Basic SEO setup",
        "Monthly maintenance & updates",
        "Email support (24hr response)"
      ]
    },
    {
      name: "Business Growth",
      icon: Rocket,
      price: "$1,200",
      period: "/month",
      description: "Scale your operations with automation",
      badge: "Most Popular",
      features: [
        "Custom site design",
        "Priority hosting with enhanced performance",
        "5 automation workflows (n8n + AI)",
        "Advanced SEO & analytics",
        "Weekly updates & optimizations",
        "Priority support (4hr response)",
        "Monthly strategy call"
      ]
    },
    {
      name: "Secure Data Package",
      icon: Building,
      price: "Custom",
      period: "",
      description: "Enterprise-grade security and infrastructure",
      badge: null,
      features: [
        "Dedicated NAS storage infrastructure",
        "Cloudflare Access control",
        "Automated backup systems",
        "Docker containerization",
        "24/7 monitoring & alerts",
        "Compliance-ready architecture",
        "White-glove support",
        "Custom SLA & terms"
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Pricing - Dolonia Data Tech Retainer Packages"
        description="Monthly retainer packages for ongoing technology support, cybersecurity, and business growth. Starter, Business Growth, and Premium Partnership options available."
        keywords="dolonia pricing, cybersecurity retainer, technology support packages, web development pricing, IT consulting rates"
        url="https://dolonia.cloud/pricing"
      />
      <Layout>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Retainer Packages</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Clear, predictable pricing based on your real needs. No hidden fees, no surprises. 
              Just straightforward monthly retainers that cover everything.
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
                    Get Started
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
                  <CardTitle className="text-lg text-foreground">Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    Yes. All retainers are month-to-month with 30 days notice to cancel. 
                    No long-term contracts or cancellation fees.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">What's included in automation workflows?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    n8n automation platform with AI integration. We build custom workflows for tasks like 
                    lead processing, data sync, email automation, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Do you work with clients outside Oklahoma?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    Absolutely. While we're based in OKC, we work with clients nationwide. 
                    All communication is remote-friendly via Slack, Zoom, or email.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">How does hosting work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft">
                    Sites are hosted on our enterprise infrastructure (Synology NAS + Cloudflare). 
                    Includes daily backups, SSL, and 99.9% uptime guarantee.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Pricing;