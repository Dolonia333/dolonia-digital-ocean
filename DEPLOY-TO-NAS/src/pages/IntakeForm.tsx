import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Building2, Cpu, Film, Landmark } from 'lucide-react'

type Division = 'dolonia_data_tech' | 'royal_society' | '1921_holding' | null

interface IntakeFormData {
  // Basic Info
  full_name: string
  company_name: string
  email: string
  phone: string
  preferred_contact: 'email' | 'text' | 'call'

  // Division & Service
  division: Division
  service_category: string
  service_focus: string[]

  // Project Details
  budget_range: string
  custom_budget?: string
  timeline: string
  referral_source: string

  // Division-Specific
  tech_details: Record<string, unknown>
  media_details: Record<string, unknown>
  business_details: Record<string, unknown>
}

export default function IntakeForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<IntakeFormData>>({
    division: null,
    service_category: '',
    service_focus: [],
    tech_details: {},
    media_details: {},
    business_details: {},
  })

  const updateFormData = (updates: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !formData.full_name ||
        !formData.email ||
        !formData.division ||
        !formData.service_category
      ) {
        toast.error('Validation Error', {
          description:
            'Please fill in all required fields: Full Name, Email, Division, and Service Category',
        })
        setIsSubmitting(false)
        return
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const formPayload = {
        full_name: formData.full_name,
        company_name: formData.company_name || null,
        email: formData.email,
        phone: formData.phone || null,
        preferred_contact: formData.preferred_contact,
        division: formData.division,
        service_category: formData.service_category,
        service_focus: formData.service_focus,
        budget_range: formData.budget_range,
        custom_budget: formData.custom_budget || null,
        timeline: formData.timeline,
        referral_source: formData.referral_source || null,
        tech_details: formData.tech_details,
        media_details: formData.media_details,
        business_details: formData.business_details,
      }

      const { error } = await supabase
        .from('intake_forms')
        // @ts-expect-error - Type definitions don't match actual schema
        .insert(formPayload)

      if (error) {
        console.error('Intake form submission error:', error)
        throw error
      }

      // Automatically upgrade user to 'client' role after intake form submission
      if (user) {
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'client' })
          .eq('id', user.id)
          .neq('role', 'admin') // Don't downgrade admins
          .neq('role', 'team_member') // Don't downgrade team members

        if (roleError) {
          console.warn('Could not update user role:', roleError)
          // Don't throw - form submission was successful
        } else {
          console.log('User upgraded to client role')
        }
      }

      toast.success('Intake Form Submitted!', {
        description:
          "You've been upgraded to a client! We'll review your request and get back to you within 24 hours.",
      })

      // Reset form
      setFormData({
        division: null,
        service_focus: [],
        tech_details: {},
        media_details: {},
        business_details: {},
      })
      setStep(1)
    } catch (error) {
      console.error('Intake form error:', error)
      let errorMessage = 'Please try again or contact us directly.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase error objects
        const err = error as Record<string, unknown>
        errorMessage =
          (err.message as string) || (err.error_description as string) || JSON.stringify(error)
      }

      toast.error('Submission Error', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <SEO
        title="Get Started - Intake Form | Dolonia"
        description="Tell us about your project and we'll match you with the right services"
      />

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Let's Get Started
            </span>
          </h1>
          <p className="text-xl" style={{ color: '#1a4d6d' }}>
            Tell us about your project and we'll create a custom solution
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num
                      ? 'bg-gradient-cyber text-ocean-deep'
                      : 'bg-ocean-surface border border-ocean-surface'
                  }`}
                  style={step < num ? { color: '#1a4d6d' } : {}}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`h-1 w-16 md:w-32 mx-2 ${
                      step > num ? 'bg-gradient-cyber' : 'bg-ocean-surface'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm" style={{ color: '#1a4d6d' }}>
            <span>Basic Info</span>
            <span>Division</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        <Card className="bg-ocean-surface/60" style={{ borderColor: 'rgba(26, 77, 109, 0.2)' }}>
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a4d6d' }}>
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) => updateFormData({ full_name: e.target.value })}
                      className="bg-ocean-deep border-ocean-surface text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-foreground">
                      Company/Brand Name
                    </Label>
                    <Input
                      id="company_name"
                      value={formData.company_name || ''}
                      onChange={(e) => updateFormData({ company_name: e.target.value })}
                      className="bg-ocean-deep border-ocean-surface text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      className="bg-ocean-deep border-ocean-surface text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      className="bg-ocean-deep border-ocean-surface text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Preferred Contact Method *</Label>
                  <RadioGroup
                    value={formData.preferred_contact}
                    onValueChange={(value: 'email' | 'text' | 'call') =>
                      updateFormData({ preferred_contact: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email_contact" />
                      <Label
                        htmlFor="email_contact"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text_contact" />
                      <Label
                        htmlFor="text_contact"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Text Message
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="call" id="call_contact" />
                      <Label
                        htmlFor="call_contact"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Phone Call
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget_range" className="text-foreground">
                      Budget Range *
                    </Label>
                    <select
                      id="budget_range"
                      value={formData.budget_range || ''}
                      onChange={(e) => {
                        console.log('Budget range changed to:', e.target.value)
                        updateFormData({ budget_range: e.target.value })
                      }}
                      className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                      required
                    >
                      <option value="">Select budget range</option>
                      <option value="under_1k">Under $1,000</option>
                      <option value="1k_3k">$1,000 - $3,000</option>
                      <option value="3k_10k">$3,000 - $10,000</option>
                      <option value="10k_plus">$10,000+</option>
                      <option value="custom">Custom Amount</option>
                    </select>
                    <p className="text-xs" style={{ color: '#1a4d6d' }}>
                      Current budget_range: {formData.budget_range || 'none'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="text-foreground">
                      Timeline *
                    </Label>
                    <select
                      id="timeline"
                      value={formData.timeline || ''}
                      onChange={(e) => updateFormData({ timeline: e.target.value })}
                      className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="this_month">This Month</option>
                      <option value="1_3_months">Next 1-3 Months</option>
                      <option value="long_term">Long-Term</option>
                    </select>
                  </div>
                </div>

                {formData.budget_range === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="custom_budget" className="text-foreground">
                      Enter Custom Budget Amount *
                    </Label>
                    <input
                      id="custom_budget"
                      type="text"
                      placeholder="e.g., $15,000 or $50,000"
                      value={formData.custom_budget || ''}
                      onChange={(e) => {
                        console.log('Custom budget changed:', e.target.value)
                        updateFormData({ custom_budget: e.target.value })
                      }}
                      className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': '#1a4d6d' } as React.CSSProperties}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="referral_source" className="text-foreground">
                    How did you hear about us?
                  </Label>
                  <Input
                    id="referral_source"
                    value={formData.referral_source || ''}
                    onChange={(e) => updateFormData({ referral_source: e.target.value })}
                    placeholder="Google, referral, social media, etc."
                    className="bg-ocean-deep border-ocean-surface text-foreground"
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.full_name ||
                    !formData.email ||
                    !formData.preferred_contact ||
                    !formData.budget_range ||
                    !formData.timeline
                  }
                  className="w-full bg-gradient-cyber hover:shadow-glow text-ocean-deep"
                >
                  Continue to Division Selection
                </Button>
              </div>
            )}

            {/* Step 2: Division Selection */}
            {step === 2 && (
              <DivisionSelection
                selected={formData.division}
                onSelect={(division) => updateFormData({ division })}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {/* Step 3: Division-Specific Details */}
            {step === 3 && formData.division && (
              <DivisionDetails
                division={formData.division}
                formData={formData}
                updateFormData={updateFormData}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <ReviewSubmit
                formData={formData}
                onBack={() => setStep(3)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

// Division Selection Component
function DivisionSelection({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: Division
  onSelect: (division: Division) => void
  onBack: () => void
  onNext: () => void
}) {
  const divisions = [
    {
      id: 'dolonia_data_tech' as Division,
      name: 'Dolonia Data Tech',
      icon: Cpu,
      description: 'Technology, Automation & Hosting',
      services: ['Websites & Apps', 'Cloud Infrastructure', 'AI Automation', 'Cybersecurity'],
    },
    {
      id: 'royal_society' as Division,
      name: 'Royal Society Management',
      icon: Film,
      description: 'Media, Branding & Creative',
      services: [
        'Photography & Video',
        'Editing & Production',
        'Branding & Design',
        'Social Media',
      ],
    },
    {
      id: '1921_holding' as Division,
      name: '1921 Holding Co.',
      icon: Landmark,
      description: 'Business & Government Contracting',
      services: ['Business Startup', 'Funding & Grants', 'Government Contracts', 'Consulting'],
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a4d6d' }}>
        Choose Your Division
      </h2>
      <p className="mb-6" style={{ color: '#1a4d6d' }}>
        Select the service area that best matches your needs
      </p>

      <div className="grid grid-cols-1 gap-4">
        {divisions.map((division) => {
          const Icon = division.icon
          const isSelected = selected === division.id

          return (
            <button
              key={division.id}
              onClick={() => onSelect(division.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'bg-cyan-bright/10'
                  : 'border-ocean-surface bg-ocean-deep/40 hover:border-opacity-50'
              }`}
              style={{
                borderColor: isSelected ? '#1a4d6d' : undefined,
                borderStyle: 'solid',
              }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    isSelected ? 'bg-gradient-cyber text-ocean-deep' : 'bg-ocean-surface'
                  }`}
                  style={{ color: isSelected ? undefined : '#1a4d6d' }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{division.name}</h3>
                  <p className="text-sm mb-3" style={{ color: '#1a4d6d' }}>
                    {division.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {division.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs px-2 py-1 rounded bg-ocean-surface"
                        style={{ color: '#1a4d6d' }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          style={{ borderColor: '#1a4d6d', color: '#1a4d6d' }}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 bg-gradient-cyber hover:shadow-glow text-ocean-deep"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

// Division Details Component
function DivisionDetails({
  division,
  formData,
  updateFormData,
  onBack,
  onNext,
}: {
  division: Division
  formData: Partial<IntakeFormData>
  updateFormData: (updates: Partial<IntakeFormData>) => void
  onBack: () => void
  onNext: () => void
}) {
  const getDetailsKey = () => {
    if (division === 'dolonia_data_tech') return 'tech_details'
    if (division === 'royal_society') return 'media_details'
    return 'business_details'
  }

  const detailsKey = getDetailsKey()
  const details = (formData[detailsKey] as Record<string, unknown>) || {}

  const updateDetails = (key: string, value: unknown) => {
    updateFormData({
      [detailsKey]: {
        ...details,
        [key]: value,
      },
    } as Partial<IntakeFormData>)
  }

  const toggleMultiSelect = (key: string, value: string) => {
    const current = (details[key] as string[]) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateDetails(key, updated)
  }

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
      <h2
        className="text-2xl font-bold mb-4 sticky top-0 bg-ocean-surface/95 py-2 z-10"
        style={{ color: '#1a4d6d' }}
      >
        {division === 'dolonia_data_tech' && 'Technology & Automation Details'}
        {division === 'royal_society' && 'Media & Creative Details'}
        {division === '1921_holding' && 'Business & Consulting Details'}
      </h2>

      <div className="space-y-6">
        {/* Dolonia Data Tech Questions */}
        {division === 'dolonia_data_tech' && (
          <>
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Primary Focus *</Label>
              <select
                value={(details.primary_focus as string) || ''}
                onChange={(e) => updateDetails('primary_focus', e.target.value)}
                className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                required
              >
                <option value="">Select primary focus</option>
                <option value="website_app">Website or App Development</option>
                <option value="hosting">Hosting or Infrastructure Setup</option>
                <option value="ai_automation">AI or Workflow Automation</option>
                <option value="cybersecurity">Cybersecurity / Network Setup</option>
                <option value="data_integration">Data or Supabase Integration</option>
              </select>
            </div>

            {/* Website & App Development */}
            {details.primary_focus === 'website_app' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">What type of site do you need?</Label>
                  <select
                    value={(details.site_type as string) || ''}
                    onChange={(e) => updateDetails('site_type', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="web_app">Web App</option>
                    <option value="portfolio">Portfolio</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Do you already have a domain?</Label>
                  <RadioGroup
                    value={(details.has_domain as string) || ''}
                    onValueChange={(value) => updateDetails('has_domain', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="domain_yes" />
                      <Label
                        htmlFor="domain_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="domain_no" />
                      <Label
                        htmlFor="domain_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you need hosting through DOLONIA DATA TECH?
                  </Label>
                  <RadioGroup
                    value={(details.needs_hosting as string) || ''}
                    onValueChange={(value) => updateDetails('needs_hosting', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="hosting_yes" />
                      <Label
                        htmlFor="hosting_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="hosting_no" />
                      <Label
                        htmlFor="hosting_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    What pages/features do you want? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Contact Form',
                      'Booking',
                      'Portfolio',
                      'Store',
                      'Dashboard',
                      'Blog',
                      'Analytics',
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature_${feature}`}
                          checked={((details.features as string[]) || []).includes(feature)}
                          onCheckedChange={() => toggleMultiSelect('features', feature)}
                        />
                        <Label
                          htmlFor={`feature_${feature}`}
                          className="cursor-pointer text-sm"
                          style={{ color: '#1a4d6d' }}
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you have existing branding (logo, colors, photos)?
                  </Label>
                  <RadioGroup
                    value={(details.has_branding as string) || ''}
                    onValueChange={(value) => updateDetails('has_branding', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="branding_yes" />
                      <Label
                        htmlFor="branding_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="branding_no" />
                      <Label
                        htmlFor="branding_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Would you like SEO optimization or analytics installed?
                  </Label>
                  <RadioGroup
                    value={(details.needs_seo as string) || ''}
                    onValueChange={(value) => updateDetails('needs_seo', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="seo_yes" />
                      <Label
                        htmlFor="seo_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="seo_no" />
                      <Label
                        htmlFor="seo_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* AI / Automation Integration */}
            {details.primary_focus === 'ai_automation' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">What process do you want automated?</Label>
                  <Textarea
                    value={(details.automation_process as string) || ''}
                    onChange={(e) => updateDetails('automation_process', e.target.value)}
                    className="bg-ocean-deep border-ocean-surface text-foreground min-h-[100px]"
                    placeholder="Describe the process you want to automate..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Are you using any current tools?</Label>
                  <Input
                    value={(details.current_tools as string) || ''}
                    onChange={(e) => updateDetails('current_tools', e.target.value)}
                    className="bg-ocean-deep border-ocean-surface text-foreground"
                    placeholder="e.g., Google Forms, Zapier, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Would you like to include AI chat, scheduling, or analytics?
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['AI Chat', 'Scheduling', 'Analytics'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ai_feature_${feature}`}
                          checked={((details.ai_features as string[]) || []).includes(feature)}
                          onCheckedChange={() => toggleMultiSelect('ai_features', feature)}
                        />
                        <Label
                          htmlFor={`ai_feature_${feature}`}
                          className="cursor-pointer text-sm"
                          style={{ color: '#1a4d6d' }}
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you need a dashboard or client portal built for your team?
                  </Label>
                  <RadioGroup
                    value={(details.needs_dashboard as string) || ''}
                    onValueChange={(value) => updateDetails('needs_dashboard', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="dashboard_yes" />
                      <Label
                        htmlFor="dashboard_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="dashboard_no" />
                      <Label
                        htmlFor="dashboard_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Cybersecurity / Network Setup */}
            {details.primary_focus === 'cybersecurity' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">
                    What devices or systems are you securing?
                  </Label>
                  <Input
                    value={(details.security_targets as string) || ''}
                    onChange={(e) => updateDetails('security_targets', e.target.value)}
                    className="bg-ocean-deep border-ocean-surface text-foreground"
                    placeholder="e.g., NAS, website, office Wi-Fi, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Would you like a privacy report or network audit?
                  </Label>
                  <RadioGroup
                    value={(details.needs_audit as string) || ''}
                    onValueChange={(value) => updateDetails('needs_audit', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="audit_yes" />
                      <Label
                        htmlFor="audit_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="audit_no" />
                      <Label
                        htmlFor="audit_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Are you interested in the Beacon Privacy Device?
                  </Label>
                  <RadioGroup
                    value={(details.beacon_interest as string) || ''}
                    onValueChange={(value) => updateDetails('beacon_interest', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="beacon_yes" />
                      <Label
                        htmlFor="beacon_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="beacon_no" />
                      <Label
                        htmlFor="beacon_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="more_info" id="beacon_info" />
                      <Label
                        htmlFor="beacon_info"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Want more info
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </>
        )}

        {/* Royal Society Management Questions */}
        {division === 'royal_society' && (
          <>
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Primary Focus *</Label>
              <select
                value={(details.primary_focus as string) || ''}
                onChange={(e) => updateDetails('primary_focus', e.target.value)}
                className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                required
              >
                <option value="">Select primary focus</option>
                <option value="photo_video">Photography / Videography</option>
                <option value="editing">Editing / Post-Production</option>
                <option value="branding">Branding / Logo / Design</option>
                <option value="social_media">Social Media / Marketing</option>
                <option value="event_coverage">Event Coverage / Talent Management</option>
              </select>
            </div>

            {/* Photography & Videography */}
            {details.primary_focus === 'photo_video' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">What kind of shoot?</Label>
                  <select
                    value={(details.shoot_type as string) || ''}
                    onChange={(e) => updateDetails('shoot_type', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="product">Product</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="event">Event</option>
                    <option value="interview">Interview</option>
                    <option value="drone">Drone</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Location preference</Label>
                  <select
                    value={(details.location_preference as string) || ''}
                    onChange={(e) => updateDetails('location_preference', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select location</option>
                    <option value="studio">Studio</option>
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you need video editing or color grading?
                  </Label>
                  <RadioGroup
                    value={(details.needs_editing as string) || ''}
                    onValueChange={(value) => updateDetails('needs_editing', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="editing_yes" />
                      <Label
                        htmlFor="editing_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="editing_no" />
                      <Label
                        htmlFor="editing_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Will you provide your own footage?</Label>
                  <RadioGroup
                    value={(details.provide_footage as string) || ''}
                    onValueChange={(value) => updateDetails('provide_footage', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="footage_yes" />
                      <Label
                        htmlFor="footage_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="footage_no" />
                      <Label
                        htmlFor="footage_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">How often will you need content?</Label>
                  <select
                    value={(details.content_frequency as string) || ''}
                    onChange={(e) => updateDetails('content_frequency', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="one_time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="retainer">Retainer</option>
                  </select>
                </div>
              </>
            )}

            {/* Branding & Design */}
            {details.primary_focus === 'branding' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">
                    What do you need designed? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Logo', 'Flyers', 'Website', 'Product Mockups', 'Lookbook'].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={`design_${item}`}
                          checked={((details.design_needs as string[]) || []).includes(item)}
                          onCheckedChange={() => toggleMultiSelect('design_needs', item)}
                        />
                        <Label
                          htmlFor={`design_${item}`}
                          className="cursor-pointer text-sm"
                          style={{ color: '#1a4d6d' }}
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you already have a color palette or logo?
                  </Label>
                  <RadioGroup
                    value={(details.has_brand_assets as string) || ''}
                    onValueChange={(value) => updateDetails('has_brand_assets', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="assets_yes" />
                      <Label
                        htmlFor="assets_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="assets_no" />
                      <Label
                        htmlFor="assets_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you need help creating a brand identity or redesign?
                  </Label>
                  <RadioGroup
                    value={(details.needs_brand_identity as string) || ''}
                    onValueChange={(value) => updateDetails('needs_brand_identity', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="identity_yes" />
                      <Label
                        htmlFor="identity_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="identity_no" />
                      <Label
                        htmlFor="identity_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Social Media & Marketing */}
            {details.primary_focus === 'social_media' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Which platforms do you use? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Twitter)', 'LinkedIn'].map(
                      (platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform_${platform}`}
                            checked={((details.platforms as string[]) || []).includes(platform)}
                            onCheckedChange={() => toggleMultiSelect('platforms', platform)}
                          />
                          <Label
                            htmlFor={`platform_${platform}`}
                            className="cursor-pointer text-sm"
                            style={{ color: '#1a4d6d' }}
                          >
                            {platform}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you want Royal Society to manage your posting?
                  </Label>
                  <RadioGroup
                    value={(details.manage_posting as string) || ''}
                    onValueChange={(value) => updateDetails('manage_posting', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="manage_yes" />
                      <Label
                        htmlFor="manage_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="manage_no" />
                      <Label
                        htmlFor="manage_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Are you interested in ads or influencer campaigns?
                  </Label>
                  <RadioGroup
                    value={(details.interested_ads as string) || ''}
                    onValueChange={(value) => updateDetails('interested_ads', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="ads_yes" />
                      <Label
                        htmlFor="ads_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="ads_no" />
                      <Label
                        htmlFor="ads_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    How often do you want performance reports?
                  </Label>
                  <select
                    value={(details.report_frequency as string) || ''}
                    onChange={(e) => updateDetails('report_frequency', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* 1921 Holding Co. Questions */}
        {division === '1921_holding' && (
          <>
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Primary Focus *</Label>
              <select
                value={(details.primary_focus as string) || ''}
                onChange={(e) => updateDetails('primary_focus', e.target.value)}
                className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                required
              >
                <option value="">Select primary focus</option>
                <option value="business_startup">Business Startup / Structure</option>
                <option value="funding">Funding / Grants / Investors</option>
                <option value="gov_contracting">Government Contracting</option>
                <option value="automation">Automation for Business Operations</option>
                <option value="consulting">Consulting / Strategy</option>
              </select>
            </div>

            {/* Business & Funding */}
            {(details.primary_focus === 'business_startup' ||
              details.primary_focus === 'funding') && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Do you have a registered LLC or EIN?</Label>
                  <RadioGroup
                    value={(details.has_llc as string) || ''}
                    onValueChange={(value) => updateDetails('has_llc', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="llc_yes" />
                      <Label
                        htmlFor="llc_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="llc_no" />
                      <Label
                        htmlFor="llc_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Are you looking for startup or expansion funding?
                  </Label>
                  <select
                    value={(details.funding_type as string) || ''}
                    onChange={(e) => updateDetails('funding_type', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="startup">Startup Funding</option>
                    <option value="expansion">Expansion Funding</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you need a business plan or capability statement?
                  </Label>
                  <RadioGroup
                    value={(details.needs_business_plan as string) || ''}
                    onValueChange={(value) => updateDetails('needs_business_plan', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="plan_yes" />
                      <Label
                        htmlFor="plan_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="plan_no" />
                      <Label
                        htmlFor="plan_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    What's your current monthly revenue (if any)?
                  </Label>
                  <Input
                    value={(details.monthly_revenue as string) || ''}
                    onChange={(e) => updateDetails('monthly_revenue', e.target.value)}
                    className="bg-ocean-deep border-ocean-surface text-foreground"
                    placeholder="e.g., $5,000 or None yet"
                  />
                </div>
              </>
            )}

            {/* Government Contracting */}
            {details.primary_focus === 'gov_contracting' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Are you registered in SAM.gov?</Label>
                  <RadioGroup
                    value={(details.sam_registered as string) || ''}
                    onValueChange={(value) => updateDetails('sam_registered', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sam_yes" />
                      <Label
                        htmlFor="sam_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sam_no" />
                      <Label
                        htmlFor="sam_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Do you have a DUNS or UEI number?</Label>
                  <RadioGroup
                    value={(details.has_uei as string) || ''}
                    onValueChange={(value) => updateDetails('has_uei', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="uei_yes" />
                      <Label
                        htmlFor="uei_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="uei_no" />
                      <Label
                        htmlFor="uei_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Would you like help writing or automating RFP/RFQ responses?
                  </Label>
                  <RadioGroup
                    value={(details.needs_rfp_help as string) || ''}
                    onValueChange={(value) => updateDetails('needs_rfp_help', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rfp_yes" />
                      <Label
                        htmlFor="rfp_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rfp_no" />
                      <Label
                        htmlFor="rfp_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you want to partner as a Subcontractor or Prime Contractor?
                  </Label>
                  <select
                    value={(details.contractor_type as string) || ''}
                    onChange={(e) => updateDetails('contractor_type', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="subcontractor">Subcontractor</option>
                    <option value="prime">Prime Contractor</option>
                    <option value="both">Either/Both</option>
                  </select>
                </div>
              </>
            )}

            {/* Consulting & Strategy */}
            {details.primary_focus === 'consulting' && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">What's your biggest current challenge?</Label>
                  <select
                    value={(details.challenge as string) || ''}
                    onChange={(e) => updateDetails('challenge', e.target.value)}
                    className="w-full px-3 py-2 bg-ocean-deep border border-ocean-surface text-foreground rounded-md"
                  >
                    <option value="">Select challenge</option>
                    <option value="funding">Funding</option>
                    <option value="operations">Operations</option>
                    <option value="clients">Getting Clients</option>
                    <option value="growth">Growth/Scaling</option>
                    <option value="automation">Automation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">
                    Do you want to schedule a 1-on-1 business consultation?
                  </Label>
                  <RadioGroup
                    value={(details.wants_consultation as string) || ''}
                    onValueChange={(value) => updateDetails('wants_consultation', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="consult_yes" />
                      <Label
                        htmlFor="consult_yes"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="consult_no" />
                      <Label
                        htmlFor="consult_no"
                        className="cursor-pointer"
                        style={{ color: '#1a4d6d' }}
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </>
        )}

        {/* Additional Notes (All Divisions) */}
        <div className="space-y-2">
          <Label className="text-foreground">Additional Notes or Questions</Label>
          <Textarea
            value={(details.additional_notes as string) || ''}
            onChange={(e) => updateDetails('additional_notes', e.target.value)}
            className="bg-ocean-deep border-ocean-surface text-foreground min-h-[100px]"
            placeholder="Anything else we should know about your project?"
          />
        </div>
      </div>

      <div className="flex gap-4 sticky bottom-0 bg-ocean-surface/95 py-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          style={{ borderColor: '#1a4d6d', color: '#1a4d6d' }}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!details.primary_focus}
          className="flex-1 bg-gradient-cyber hover:shadow-glow text-ocean-deep"
        >
          Review & Submit
        </Button>
      </div>
    </div>
  )
}

// Review & Submit Component
function ReviewSubmit({
  formData,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  formData: Partial<IntakeFormData>
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a4d6d' }}>
        Review Your Submission
      </h2>

      <div className="space-y-4 bg-ocean-deep/40 p-6 rounded-lg">
        <div>
          <h3 className="text-sm mb-1" style={{ color: '#1a4d6d' }}>
            Contact Information
          </h3>
          <p className="text-foreground">{formData.full_name}</p>
          <p className="text-foreground">{formData.email}</p>
          {formData.phone && <p className="text-foreground">{formData.phone}</p>}
        </div>

        <div>
          <h3 className="text-sm mb-1" style={{ color: '#1a4d6d' }}>
            Division
          </h3>
          <p className="text-foreground">
            {formData.division === 'dolonia_data_tech' && 'Dolonia Data Tech'}
            {formData.division === 'royal_society' && 'Royal Society Management'}
            {formData.division === '1921_holding' && '1921 Holding Co.'}
          </p>
        </div>

        <div>
          <h3 className="text-sm mb-1" style={{ color: '#1a4d6d' }}>
            Budget & Timeline
          </h3>
          <p className="text-foreground">
            Budget:{' '}
            {formData.budget_range === 'custom'
              ? formData.custom_budget
              : formData.budget_range?.replace('_', ' - ')}
          </p>
          <p className="text-foreground">Timeline: {formData.timeline}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
          style={{ borderColor: '#1a4d6d', color: '#1a4d6d' }}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-gradient-cyber hover:shadow-glow text-ocean-deep"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
        </Button>
      </div>
    </div>
  )
}
