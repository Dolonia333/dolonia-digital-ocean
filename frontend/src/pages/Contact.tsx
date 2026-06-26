import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Mail, MapPin, Clock, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import AppointmentBookingCalendar from '@/components/AppointmentBookingCalendar'

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface ContactInfo {
  icon: React.ElementType
  title: string
  content: string
  description: string
  link?: string
}

const Contact = () => {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasBookedAppointment, setHasBookedAppointment] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })

  // Handle pre-populated data from other components
  useEffect(() => {
    const contactType = searchParams.get('type')
    let prefilledData: Partial<FormData> = {}

    if (contactType === 'consultation') {
      // Handle consultation requests from cost calculator
      const consultationConfig = localStorage.getItem('dolonia-consultation-config')
      if (consultationConfig) {
        const config = JSON.parse(consultationConfig)
        prefilledData = {
          subject: 'Consultation Request - Custom Configuration',
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

Please contact me to discuss this configuration and schedule a consultation.`,
        }
        localStorage.removeItem('dolonia-consultation-config')
      } else {
        prefilledData = {
          subject: 'Consultation Request',
          message:
            "I'm interested in scheduling a consultation to discuss my cybersecurity needs. Please contact me with available times.",
        }
      }
    } else if (contactType === 'deployment') {
      // Handle deployment requests from interactive demo
      const demoCompleted = localStorage.getItem('dolonia-demo-completed')
      if (demoCompleted) {
        prefilledData = {
          subject: 'Real Deployment Request - After Demo',
          message:
            "I've completed your interactive deployment demo and I'm interested in implementing a similar solution for my infrastructure. Please contact me to discuss the next steps and pricing for a real deployment.",
        }
        localStorage.removeItem('dolonia-demo-completed')
      }
    } else {
      // Handle general get started requests from cost calculator
      const calculatorConfig = localStorage.getItem('dolonia-calculator-config')
      if (calculatorConfig) {
        const config = JSON.parse(calculatorConfig)
        prefilledData = {
          subject: 'Get Started - Custom Configuration',
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

Please contact me to get started with this setup.`,
        }
        localStorage.removeItem('dolonia-calculator-config')
      }
    }

    if (Object.keys(prefilledData).length > 0) {
      setFormData((prev) => ({ ...prev, ...prefilledData }))
    }
  }, [searchParams])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Save contact form data to Supabase leads table
      const { data, error } = await (supabase as any)
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            message: `Subject: ${formData.subject}\n\n${formData.message}`,
            source: 'contact_form',
            status: 'new',
          },
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to submit form')
      }

      console.log('Form submitted successfully:', data)

      setIsSubmitted(true)
      toast({
        title: 'Message Sent Successfully!',
        description: "We'll get back to you within 24 hours.",
      })

      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      })

      // Reset submission state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error('Contact form error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast({
        title: 'Error sending message',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'zion@royalsocietymanagementgroup.com',
      description: 'Send us an email anytime',
      link: 'mailto:zion@royalsocietymanagementgroup.com',
    },
    {
      icon: MessageCircle,
      title: 'Chat With Us',
      content: 'Use the Dolonia assistant for instant support',
      description: 'Available 24/7 right from this page',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '600 N. Robinson Ave, 6th Floor, Office #680, Oklahoma City, OK 73102',
      description: 'Our headquarters',
      link: 'https://maps.google.com/?q=600+N.+Robinson+Ave,+6th+Floor,+Office+680,+Oklahoma+City,+OK+73102',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday: 8am - 6pm CST',
      description: 'Weekend support available',
    },
  ]

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
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Get In Touch</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Ready to transform your business with our cloud solutions? Schedule a meeting with our
              team.
            </p>
          </div>

          {/* Appointment Booking Calendar */}
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="bg-ocean-surface/50 border-ocean-surface backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl bg-gradient-cyber bg-clip-text text-transparent">
                  Schedule a Meeting
                </CardTitle>
                <CardDescription className="text-cyan-soft text-lg">
                  Book a time to speak with our team. Select a date and available time slot below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentBookingCalendar
                  onBookingSuccess={() => setHasBookedAppointment(true)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Contact Information - Only shown after booking */}
          {hasBookedAppointment && (
            <div className="max-w-4xl mx-auto">
              <Card className="bg-ocean-surface/30 border-ocean-surface backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Contact Information</CardTitle>
                  <CardDescription className="text-cyan-soft">
                    Thank you for scheduling! Here are additional ways to reach our team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-ocean-deep" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
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
                        <p className="text-cyan-soft text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Contact
