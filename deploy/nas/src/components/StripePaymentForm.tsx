import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface CheckoutFormProps {
  clientSecret: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function CheckoutForm({ clientSecret, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
        onError?.(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!')
        onSuccess?.()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      toast.error(message)
      onError?.(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full mt-6">
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}

interface StripePaymentFormProps {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, string>
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function StripePaymentForm({
  amount,
  currency = 'usd',
  description = 'Payment',
  metadata,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const createPaymentIntent = async () => {
    setIsLoading(true)
    try {
      // Call Vite dev server middleware
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const result = await response.json()

      if (result.clientSecret) {
        setClientSecret(result.clientSecret)
      } else {
        throw new Error('Failed to create payment intent')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize payment'
      toast.error(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#0ea5e9',
          },
        },
      }
    : null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          {description} - ${amount.toFixed(2)} {currency.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!clientSecret ? (
          <Button onClick={createPaymentIntent} disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Continue to Payment'}
          </Button>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
          </Elements>
        )}
      </CardContent>
    </Card>
  )
}
