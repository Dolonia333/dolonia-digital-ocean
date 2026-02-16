import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, DollarSign } from 'lucide-react';

interface CaseStudy {
  title: string;
  client: string;
  date: string;
  value: string;
  description: string;
  services: string[];
  results: string[];
  link?: string;
}

const caseStudies: CaseStudy[] = [
  {
    title: "E-Commerce Peptides Platform",
    client: "Enhanced Games Peptides",
    date: "2024",
    value: "$1,600",
    description: "Complete website build with product catalog, secure checkout, and customer portal for a peptides e-commerce business.",
    services: ["WordPress Development", "E-Commerce Setup", "Secure Hosting", "SEO Optimization"],
    results: [
      "Professional online storefront",
      "Secure payment processing",
      "Customer account management",
      "Mobile-responsive design"
    ]
  },
  {
    title: "Media & Automation Platform",
    client: "Thunder Walker (via RSMG)",
    date: "2025",
    value: "$1,000+/month",
    description: "Ongoing partnership delivering media management and automation workflows for creative projects.",
    services: ["Custom Automation", "Workflow Integration", "Media Processing", "Technical Consulting"],
    results: [
      "Automated content workflows",
      "Reduced manual processing time",
      "Scalable infrastructure",
      "Ongoing technical support"
    ]
  },
  {
    title: "Small Business Website Portfolio",
    client: "Multiple Clients",
    date: "2023-2024",
    value: "$3,000+",
    description: "Series of professional websites for local Oklahoma City businesses, including restaurants, services, and retail.",
    services: ["WordPress Development", "Custom Design", "SEO Setup", "Maintenance Plans"],
    results: [
      "4+ successful launches",
      "Improved local search visibility",
      "Mobile-first design",
      "Ongoing maintenance relationships"
    ]
  }
];

const CaseStudies: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-ocean-surface/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Real Projects, Real Results
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            From local SMBs to ongoing partnerships, here's what we've built for clients in Oklahoma and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {caseStudies.map((study, index) => (
            <Card 
              key={index}
              className="border-ocean-surface bg-ocean-surface/30 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-bright/10 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                  {study.link && (
                    <ExternalLink className="h-5 w-5 text-cyan-bright" />
                  )}
                </div>
                <CardDescription className="text-cyan-soft font-medium">
                  {study.client}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm text-cyan-soft">
                    <Calendar className="h-4 w-4 mr-1" />
                    {study.date}
                  </div>
                  <div className="flex items-center text-sm text-cyan-bright font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {study.value}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-cyan-soft text-sm">
                  {study.description}
                </p>

                <div>
                  <h4 className="text-sm font-semibold text-cyan-bright mb-2">Services Provided:</h4>
                  <div className="flex flex-wrap gap-2">
                    {study.services.map((service, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="border-cyan-bright/30 text-cyan-soft text-xs"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-cyan-bright mb-2">Key Results:</h4>
                  <ul className="space-y-1">
                    {study.results.map((result, idx) => (
                      <li key={idx} className="text-xs text-cyan-soft flex items-start">
                        <div className="w-1 h-1 bg-cyan-bright rounded-full mr-2 mt-1.5 flex-shrink-0" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-cyan-soft">
            Ready to be our next success story? Let's talk about your project.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
