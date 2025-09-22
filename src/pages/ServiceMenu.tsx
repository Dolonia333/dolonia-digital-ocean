import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Globe, Download, FileText } from 'lucide-react';
import doloniaLogo from '@/assets/dolonia-logo.png';

const ServiceMenu = () => {
  const businessInfo = {
    name: "Dolonia Data Tech",
    phone: "(405) 967-0503",
    email: "zion@royalsocietymanagement.com",
    website: "Dolonia.cloud",
    address: "600 N. Robinson Ave, 6th Floor, Office #680, Oklahoma City, OK 73102"
  };

  const servicePackages = [
    {
      category: "Automation & Workflow",
      services: [
        {
          name: "Process Automation Setup",
          description: "Streamline repetitive tasks and workflows",
          pricing: [
            { tier: "Basic", price: "$500", note: "Up to 3 workflows" },
            { tier: "Standard", price: "$1,200", note: "Up to 10 workflows" },
            { tier: "Premium", price: "$2,500", note: "Unlimited workflows + training" }
          ]
        },
        {
          name: "Database Management",
          description: "Optimize and manage your data infrastructure",
          pricing: [
            { tier: "Basic", price: "$800", note: "Single database optimization" },
            { tier: "Standard", price: "$1,800", note: "Multi-database management" },
            { tier: "Enterprise", price: "$3,500", note: "Full data architecture" }
          ]
        }
      ]
    },
    {
      category: "Security & Compliance",
      services: [
        {
          name: "Security Audit & Implementation",
          description: "Comprehensive security assessment and hardening",
          pricing: [
            { tier: "Assessment", price: "$1,000", note: "Security audit only" },
            { tier: "Implementation", price: "$2,500", note: "Audit + basic security" },
            { tier: "Enterprise", price: "$5,000", note: "Full security overhaul" }
          ]
        },
        {
          name: "Compliance Solutions",
          description: "GDPR, HIPAA, SOC2 compliance implementation",
          pricing: [
            { tier: "Standard", price: "$2,000", note: "Single compliance framework" },
            { tier: "Multi-Framework", price: "$4,500", note: "2-3 frameworks" },
            { tier: "Enterprise", price: "$8,000", note: "Full compliance suite" }
          ]
        }
      ]
    },
    {
      category: "Cloud & Infrastructure",
      services: [
        {
          name: "Cloud Migration",
          description: "Seamless migration to cloud infrastructure",
          pricing: [
            { tier: "Small", price: "$3,000", note: "Up to 5 applications" },
            { tier: "Medium", price: "$7,500", note: "10-20 applications" },
            { tier: "Enterprise", price: "$15,000", note: "Complete infrastructure" }
          ]
        },
        {
          name: "Infrastructure Monitoring",
          description: "24/7 monitoring and maintenance",
          pricing: [
            { tier: "Basic", price: "$500/month", note: "Basic monitoring" },
            { tier: "Advanced", price: "$1,200/month", note: "Advanced analytics" },
            { tier: "Enterprise", price: "$2,500/month", note: "Full managed service" }
          ]
        }
      ]
    },
    {
      category: "Development & Integration",
      services: [
        {
          name: "API Development",
          description: "Custom API creation and integration",
          pricing: [
            { tier: "Simple", price: "$1,500", note: "Basic REST API" },
            { tier: "Complex", price: "$3,500", note: "Advanced API with auth" },
            { tier: "Enterprise", price: "$7,000", note: "Full API ecosystem" }
          ]
        },
        {
          name: "System Integration",
          description: "Connect and synchronize your business systems",
          pricing: [
            { tier: "2 Systems", price: "$2,000", note: "Simple integration" },
            { tier: "5 Systems", price: "$5,000", note: "Multi-system sync" },
            { tier: "Enterprise", price: "$10,000", note: "Complete ecosystem" }
          ]
        }
      ]
    }
  ];

  const retainerPackages = [
    {
      name: "Startup Accelerator",
      price: "$2,500/month",
      description: "Perfect for growing startups needing foundational tech infrastructure",
      features: [
        "20 hours of development time",
        "Basic security audit",
        "Cloud setup and optimization",
        "Email support (response within 24h)",
        "Monthly strategy consultation"
      ]
    },
    {
      name: "Business Growth",
      price: "$5,000/month",
      description: "Ideal for established businesses scaling their operations",
      features: [
        "40 hours of development time",
        "Advanced security implementation",
        "Database optimization",
        "Process automation setup",
        "Priority support (response within 4h)",
        "Bi-weekly strategic reviews"
      ]
    },
    {
      name: "Enterprise Solutions",
      price: "$10,000/month",
      description: "Comprehensive solution for large organizations",
      features: [
        "80 hours of development time",
        "Full compliance management",
        "Advanced monitoring & analytics",
        "Custom integrations",
        "24/7 priority support",
        "Weekly strategic consultations",
        "Dedicated account manager"
      ]
    }
  ];

  const handleDownload = () => {
    // Create a downloadable version
    const content = `
DOLONIA DATA TECH - SERVICE MENU 2025

Contact Information:
• Phone: ${businessInfo.phone}
• Email: ${businessInfo.email}
• Website: ${businessInfo.website}
• Address: ${businessInfo.address}

${servicePackages.map(category => `
${category.category.toUpperCase()}
${category.services.map(service => `
• ${service.name} - ${service.description}
  ${service.pricing.map(p => `- ${p.tier}: ${p.price} (${p.note})`).join('\n  ')}
`).join('')}
`).join('')}

RETAINER PACKAGES
${retainerPackages.map(pkg => `
• ${pkg.name} - ${pkg.price}
  ${pkg.description}
  Features: ${pkg.features.join(', ')}
`).join('')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dolonia-services-menu-2025.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      <BinaryRain />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-16">
          {/* Header with Business Info */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img 
                src={doloniaLogo} 
                alt="Dolonia Logo" 
                className="w-24 h-24 md:w-32 md:h-32"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Dolonia Data Tech</span>
            </h1>
            <p className="text-2xl text-cyan-bright mb-4">Services & Pricing Menu (2025)</p>
            
            {/* Business Contact Card */}
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm max-w-2xl mx-auto mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">{businessInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">{businessInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-cyan-bright" />
                    <span className="text-foreground">{businessInfo.website}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-cyan-bright mt-1" />
                    <span className="text-foreground text-sm">{businessInfo.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleDownload}
              className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold mb-8"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Service Menu
            </Button>
          </div>

          {/* Service Categories */}
          <div className="space-y-12">
            {servicePackages.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-3xl font-bold text-center mb-8">
                  <span className="bg-gradient-cyber bg-clip-text text-transparent">
                    {category.category}
                  </span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {category.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground">{service.name}</CardTitle>
                        <CardDescription className="text-cyan-soft">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {service.pricing.map((price, priceIndex) => (
                            <div key={priceIndex} className="flex items-center justify-between p-3 bg-ocean-deep/50 rounded-lg">
                              <div>
                                <Badge variant="outline" className="text-cyan-bright border-cyan-bright">
                                  {price.tier}
                                </Badge>
                                <p className="text-sm text-cyan-soft mt-1">{price.note}</p>
                              </div>
                              <span className="text-xl font-bold text-cyan-bright">{price.price}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Retainer Packages */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Monthly Retainer Packages
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {retainerPackages.map((pkg, index) => (
                <Card key={index} className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-cyan-bright">{pkg.price}</div>
                    <CardDescription className="text-cyan-soft">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cyan-bright rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-cyan-soft">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* WordPress Template Note */}
          <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm max-w-4xl mx-auto mt-16">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center">
                <FileText className="w-6 h-6 mr-2 text-cyan-bright" />
                WordPress Template Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-cyan-soft space-y-4">
                <p>To convert this service menu to a WordPress template:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Copy the HTML structure from this page's source code</li>
                  <li>Convert the React components to WordPress PHP template tags</li>
                  <li>Use WordPress custom fields for dynamic pricing updates</li>
                  <li>Style with your theme's CSS or use the Tailwind classes provided</li>
                  <li>Add WordPress contact forms and integrate with your CRM</li>
                </ol>
                <p className="text-cyan-bright">
                  This page serves as your complete service menu reference with all current pricing and contact information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceMenu;