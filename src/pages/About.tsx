import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { label: "Global Clients", value: "500+", icon: Globe },
    { label: "Team Members", value: "200+", icon: Users },
    { label: "Uptime SLA", value: "99.99%", icon: Target },
    { label: "Security Certifications", value: "25+", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      <BinaryRain />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">About Dolonia</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto mb-12">
              Leading the digital transformation revolution with cutting-edge cloud infrastructure and unparalleled expertise.
            </p>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm text-center group hover:bg-ocean-surface/70 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:shadow-glow transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-ocean-deep" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-cyan-bright">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-cyan-soft">{stat.label}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-cyan-soft text-lg leading-relaxed">
                  At Dolonia, we believe that cloud computing should be secure, scalable, and simple. 
                  Our mission is to empower businesses of all sizes to harness the full potential of 
                  the cloud through innovative solutions, expert guidance, and unwavering commitment 
                  to security and performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;