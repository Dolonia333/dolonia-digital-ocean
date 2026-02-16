import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import LoadingSpinner from '@/components/LoadingSpinner'

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const { toast } = useToast()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validation
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)

    try {
      // Insert email into Supabase newsletter_subscribers table
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.trim().toLowerCase(),
            source: 'website',
            ip_address: null,
            user_agent: navigator.userAgent,
            unsubscribed_at: null,
          },
        ])
        .select()

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast({
            title: 'Already subscribed!',
            description: 'This email is already on our newsletter list.',
            variant: 'default',
          })
          setEmail('')
          setIsSubscribed(true)
          setTimeout(() => setIsSubscribed(false), 3000)
        } else {
          throw error
        }
      } else {
        // Success
        setIsSubscribed(true)
        setEmail('')

        toast({
          title: 'Successfully subscribed!',
          description: "You'll receive our latest updates and insights.",
        })

        // Reset subscription state after 5 seconds
        setTimeout(() => setIsSubscribed(false), 5000)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)

      toast({
        title: 'Subscription failed',
        description: 'There was an error subscribing. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 bg-ocean-deep">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-ocean-surface/50 backdrop-blur-sm border border-ocean-surface rounded-2xl p-8 md:p-12 cyber-glow">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-ocean-deep" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Stay in the Loop
              </span>
            </h2>

            <p className="text-xl text-cyan-soft mb-8 max-w-2xl mx-auto">
              Get the latest insights on cloud infrastructure, security updates, and industry trends
              delivered to your inbox.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-ocean-surface border-ocean-surface text-foreground placeholder-cyan-soft/50 focus:border-cyan-bright transition-colors ${
                        errors.email ? 'border-red-400 focus:border-red-400' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="flex items-center mt-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold px-8 transition-all duration-300 min-w-[120px]"
                  >
                    {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Subscribe'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-cyan-bright animate-fade-in">
                <CheckCircle className="w-6 h-6 animate-pulse" />
                <span className="text-lg font-medium">Thank you for subscribing!</span>
              </div>
            )}

            <p className="text-sm text-cyan-soft/70 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
