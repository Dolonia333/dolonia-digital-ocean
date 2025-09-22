import React, { useState } from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "zion@royalsocietymanagement.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "(405) 967-0503",
      description: "Mon-Fri from 8am to 6pm CST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "600 N. Robinson Ave, 6th Floor, Office #680, Oklahoma City, OK 73102",
      description: "Our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 8am - 6pm CST",
      description: "Weekend support available"
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
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Get In Touch</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Ready to transform your business with our cloud solutions? Let's start the conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a message</CardTitle>
                <CardDescription className="text-cyan-soft">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright resize-none"
                      placeholder="Tell us more about your project or requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold transition-all duration-300"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Contact Information</CardTitle>
                  <CardDescription className="text-cyan-soft">
                    Multiple ways to reach our team of cloud experts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-ocean-deep" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        <p className="text-cyan-bright font-medium">{info.content}</p>
                        <p className="text-cyan-soft text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Enterprise Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft mb-4">
                    Need immediate assistance? Our enterprise support team is available 24/7 
                    for critical issues and priority support requests.
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep transition-all duration-300"
                  >
                    Contact Enterprise Support
                  </Button>
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

export default Contact;