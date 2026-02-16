import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechFlow",
      company: "TechFlow Solutions",
      content: "Dolonia transformed our infrastructure overnight. The security features and scalability are unmatched.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "DevOps Lead",
      company: "CloudFirst Inc",
      content: "The AI-powered optimization saved us 40% on cloud costs while improving performance significantly.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of IT",
      company: "MedTech Global",
      content: "Zero-trust security implementation was seamless. Our compliance audits have never been easier.",
      rating: 5,
      avatar: "EW"
    }
  ];

  return (
    <section className="py-20 bg-ocean-deep/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
            See what our clients say about their transformation journey with Dolonia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-ocean-surface/50 backdrop-blur-sm border-ocean-surface hover:border-cyan-bright/30 transition-all duration-300 hover:scale-105 hover:shadow-glow"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-cyan-bright fill-current" />
                  ))}
                </div>
                
                <div className="flex items-start mb-4">
                  <Quote className="w-6 h-6 text-cyan-bright/50 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-cyan-soft leading-relaxed">{testimonial.content}</p>
                </div>

                <div className="flex items-center mt-6">
                  <div className="w-12 h-12 bg-gradient-cyber rounded-full flex items-center justify-center text-ocean-deep font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-cyan-soft">{testimonial.role}</p>
                    <p className="text-sm text-cyan-soft/70">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;