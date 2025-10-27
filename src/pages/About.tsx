import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Globe, Heart, Shield, Lightbulb, Handshake, Mail, MessageCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { label: "Global Clients", value: "500+", icon: Globe },
    { label: "Team Members", value: "200+", icon: Users },
    { label: "Uptime SLA", value: "99.99%", icon: Target },
    { label: "Security Certifications", value: "25+", icon: Award }
  ];

  const values = [
    { title: "Innovation", description: "Constantly evolving to deliver the best technology", icon: Lightbulb },
    { title: "Integrity", description: "Building systems and relationships that clients can trust", icon: Shield },
    { title: "Accessibility", description: "Making advanced tools available to every business", icon: Heart },
    { title: "Partnership", description: "Working alongside clients as a trusted ally in growth", icon: Handshake }
  ];

  const offerings = [
    "Web Development & Hosting – Custom website design, user-friendly interfaces, and reliable hosting with built-in storage",
    "Automation & Intelligent Systems – Streamlining repetitive tasks and building assistants that save time and resources", 
    "IT & Security Solutions – Business-ready setups, audits, and protective systems to keep operations running smoothly",
    "Consulting & Strategy – Business plans, pitch decks, and guidance to position companies for long-term success"
  ];

  return (
    <>
      <SEO 
        title="About Dolonia Data Tech - Technology Solutions & Cybersecurity"
        description="Learn about Dolonia Data Tech, a leading technology solutions company based in Oklahoma City. We provide secure, reliable, and future-ready digital systems for business growth."
        keywords="about dolonia data tech, cybersecurity company oklahoma, technology solutions, web development, automation, IT security"
        url="https://dolonia.cloud/about"
      />
      <Layout>
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">About Dolonia Data Tech</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto mb-12">
              Technology solutions company focused on creating secure, reliable, and future-ready digital systems that help businesses grow and operate with confidence.
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

          {/* Who We Are */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Who We Are</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft text-lg leading-relaxed text-center">
                  Dolonia Data Tech is a technology solutions company based in Oklahoma City, Oklahoma. We focus on creating 
                  <strong className="text-cyan-bright"> secure, reliable, and future-ready digital systems</strong> that help businesses grow and operate with confidence. 
                  From custom websites and hosting to automation, intelligent assistants, and business consulting, we design tools that make technology simple and effective.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Our Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-cyan-soft text-lg leading-relaxed">
                  Dolonia Data Tech was built with a clear goal: to give businesses the same high-level technology that large enterprises use, but in a way that's 
                  <strong className="text-cyan-bright"> accessible, affordable, and easy to understand</strong>.
                </p>
                <p className="text-cyan-soft text-lg leading-relaxed">
                  What started as a vision to combine <strong className="text-cyan-bright">design, automation, and secure hosting</strong> has grown into a company trusted to deliver 
                  <strong className="text-cyan-bright"> scalable solutions</strong> that meet the demands of a fast-changing digital world.
                </p>
                <p className="text-cyan-soft text-lg leading-relaxed">
                  We understand the challenges small businesses and startups face — limited resources, growing demands, and the need to stay competitive. 
                  That's why we've made it our mission to provide <strong className="text-cyan-bright">technology that works for you, not against you</strong>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Vision - Side by Side */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft text-lg leading-relaxed mb-4">
                  Our mission is to <strong className="text-cyan-bright">simplify complex technology</strong> and give every business the tools to:
                </p>
                <ul className="text-cyan-soft space-y-2">
                  <li>• Build a powerful online presence</li>
                  <li>• Automate processes and save time</li>
                  <li>• Protect data with secure hosting and storage</li>
                  <li>• Scale with confidence through strategy and innovation</li>
                </ul>
                <p className="text-cyan-soft text-lg leading-relaxed mt-4">
                  We don't just build systems — we build <strong className="text-cyan-bright">pathways to growth and independence</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-soft text-lg leading-relaxed mb-4">
                  Our vision is to become a <strong className="text-cyan-bright">national leader in business technology solutions</strong>, recognized for making advanced digital systems simple, secure, and sustainable.
                </p>
                <p className="text-cyan-soft text-lg leading-relaxed">
                  We see a future where businesses of all sizes can access <strong className="text-cyan-bright">enterprise-level tools without enterprise-level headaches</strong>, 
                  where technology becomes a <strong className="text-cyan-bright">driver of growth and creativity</strong> instead of a burden.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Offer */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">What We Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offerings.map((offering, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gradient-cyber rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-cyan-soft text-lg leading-relaxed">{offering}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm text-center group hover:bg-ocean-surface/70 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:shadow-glow transition-all duration-300">
                      <value.icon className="w-6 h-6 text-ocean-deep" />
                    </div>
                    <CardTitle className="text-xl font-bold text-cyan-bright">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-cyan-soft">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Let's Build Together</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-cyan-soft text-lg leading-relaxed">
                  At Dolonia Data Tech, we're more than just a service provider — we're your <strong className="text-cyan-bright">partner in digital growth</strong>. 
                  Whether you're a startup building your first website, or a company ready to scale with automation and strategy, we're here to make it happen.
                </p>
                <p className="text-xl font-semibold text-cyan-bright mb-6">
                  👉 Let's build the future of your business together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild className="bg-gradient-cyber hover:shadow-glow transition-all duration-300">
                    <a href="mailto:zion@royalsocietymanagement.com" className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Contact Us Today</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-cyan-bright text-cyan-bright hover:bg-cyan-bright/10"
                  >
                    <a href="/contact" className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Book a Consultation</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default About;