import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactInfo {
  icon: React.ElementType;
  title: string;
  content: string;
  description: string;
  link?: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  // Handle pre-populated data from other components
  useEffect(() => {
    const contactType = searchParams.get('type');
    let prefilledData: Partial<FormData> = {};

    if (contactType === 'consultation') {
      // Handle consultation requests from cost calculator
      const consultationConfig = localStorage.getItem('dolonia-consultation-config');
      if (consultationConfig) {
        const config = JSON.parse(consultationConfig);
        prefilledData = {
          subject: "Consultation Request - Custom Configuration",
          message: `I'm interested in scheduling a consultation to discuss a custom configuration:

Configuration Details:
- Servers: ${config.config.servers}
- Storage: ${config.config.storage} GB
- Bandwidth: ${config.config.bandwidth} GB
- Users: ${config.config.users}
- Security Level: ${config.config.securityLevel}
- AI Optimization: ${config.config.aiOptimization ? 'Yes' : 'No'}
- Multi-Cloud: ${config.config.multiCloud ? 'Yes' : 'No'}

Estimated Cost: $${config.costs.total}/month

Please contact me to discuss this configuration and schedule a consultation.`
        };
        localStorage.removeItem('dolonia-consultation-config');
      } else {
        prefilledData = {
          subject: "Consultation Request",
          message: "I'm interested in scheduling a consultation to discuss my cybersecurity needs. Please contact me with available times."
        };
      }
    } else if (contactType === 'deployment') {
      // Handle deployment requests from interactive demo
      const demoCompleted = localStorage.getItem('dolonia-demo-completed');
      if (demoCompleted) {
        prefilledData = {
          subject: "Real Deployment Request - After Demo",
          message: "I've completed your interactive deployment demo and I'm interested in implementing a similar solution for my infrastructure. Please contact me to discuss the next steps and pricing for a real deployment."
        };
        localStorage.removeItem('dolonia-demo-completed');
      }
    } else {
      // Handle general get started requests from cost calculator
      const calculatorConfig = localStorage.getItem('dolonia-calculator-config');
      if (calculatorConfig) {
        const config = JSON.parse(calculatorConfig);
        prefilledData = {
          subject: "Get Started - Custom Configuration",
          message: `I'm interested in getting started with Dolonia services based on this configuration:

Configuration:
- Servers: ${config.config.servers}
- Storage: ${config.config.storage} GB  
- Bandwidth: ${config.config.bandwidth} GB
- Users: ${config.config.users}
- Security Level: ${config.config.securityLevel}
- AI Optimization: ${config.config.aiOptimization ? 'Yes' : 'No'}
- Multi-Cloud: ${config.config.multiCloud ? 'Yes' : 'No'}

Estimated Cost: $${config.costs.total}/month

Please contact me to get started with this setup.`
        };
        localStorage.removeItem('dolonia-calculator-config');
      }
    }

    if (Object.keys(prefilledData).length > 0) {
      setFormData(prev => ({ ...prev, ...prefilledData }));
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import and use the email service
      const { sendContactEmail } = await import('@/server/email');
      await sendContactEmail(formData);

      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });

      // Reset submission state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "zion@royalsocietymanagementgroup.com",
      description: "Send us an email anytime",
      link: "mailto:zion@royalsocietymanagementgroup.com",
    },
    {
      icon: MessageCircle,
      title: "Chat With Us",
      content: "Use the Dolonia assistant for instant support",
      description: "Available 24/7 right from this page",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content:
        "600 N. Robinson Ave, 6th Floor, Office #680, Oklahoma City, OK 73102",
      description: "Our headquarters",
      link: "https://maps.google.com/?q=600+N.+Robinson+Ave,+6th+Floor,+Office+680,+Oklahoma+City,+OK+73102",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 8am - 6pm CST",
      description: "Weekend support available",
    },
  ];

  return (
    <Layout>
      <SEO
        title="Contact Us - Get in Touch with Dolonia"
        description="Ready to transform your business with our cloud solutions? Contact our expert team today. Get cybersecurity solutions tailored to your needs."
        keywords="contact dolonia, cybersecurity consultation, cloud solutions contact, get quote cybersecurity"
      />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Ready to transform your business with our cloud solutions? Let's
              start the conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Send us a message
                </CardTitle>
                <CardDescription className="text-cyan-soft">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-cyan-bright mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-cyan-soft mb-4">
                      We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">
                          Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright ${
                            errors.name
                              ? "border-red-400 focus:border-red-400"
                              : ""
                          }`}
                          placeholder="Your full name"
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <div className="flex items-center text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.name}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright ${
                            errors.email
                              ? "border-red-400 focus:border-red-400"
                              : ""
                          }`}
                          placeholder="your@email.com"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <div className="flex items-center text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-foreground">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright"
                        placeholder="Your company name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright ${
                          errors.subject
                            ? "border-red-400 focus:border-red-400"
                            : ""
                        }`}
                        placeholder="What can we help you with?"
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <div className="flex items-center text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.subject}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`bg-ocean-deep/50 border-ocean-surface text-foreground focus:border-cyan-bright resize-none ${
                          errors.message
                            ? "border-red-400 focus:border-red-400"
                            : ""
                        }`}
                        placeholder="Tell us more about your project or requirements..."
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <div className="flex items-center text-red-400 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.message}
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold transition-all duration-300 min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="sm" text="Sending..." />
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">
                    Contact Information
                  </CardTitle>
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-cyan-bright font-medium break-words hover:text-cyan-glow transition-colors duration-200 block leading-relaxed"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-cyan-bright font-medium break-words leading-relaxed">
                            {info.content}
                          </p>
                        )}
                        <p className="text-cyan-soft text-sm mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    Enterprise Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-soft mb-4">
                    Need immediate assistance? Our enterprise support team is
                    available 24/7 for critical issues and priority support
                    requests.
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
      </div>
    </Layout>
  );
};

export default Contact;
