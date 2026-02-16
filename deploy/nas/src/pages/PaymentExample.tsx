import { useState } from 'react'
import { StripePaymentForm } from '@/components/StripePaymentForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function PaymentExample() {
  const [amount, setAmount] = useState(10.0)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handlePaymentSuccess = () => {
    toast.success('Payment completed successfully!')
    setShowPaymentForm(false)
    // You can add additional logic here, like updating your database
  }

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`)
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stripe Payment Integration</h1>
        <p className="text-muted-foreground">
          Complete Stripe payment setup with React + TypeScript
        </p>
      </div>

      {!showPaymentForm ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Enter Payment Amount</CardTitle>
            <CardDescription>Set the amount you want to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.50"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="mt-2"
              />
            </div>
            <Button
              onClick={() => setShowPaymentForm(true)}
              disabled={amount < 0.5}
              className="w-full"
            >
              Continue to Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setShowPaymentForm(false)} className="mb-4">
            ← Back
          </Button>
          <StripePaymentForm
            amount={amount}
            currency="usd"
            description="Example Payment"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      )}

      <div className="mt-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Setup Complete! 🎉</CardTitle>
            <CardDescription>Here's what's been configured:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">✅ Environment Variables</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>VITE_STRIPE_SECRET_KEY (for backend)</li>
                <li>VITE_STRIPE_PUBLISHABLE_KEY (for frontend)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">✅ Files Created</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>src/lib/stripe.ts - Stripe client initialization</li>
                <li>src/server/stripe.ts - Server-side Stripe functions</li>
                <li>src/server/stripe-api.ts - API handlers</li>
                <li>src/components/StripePaymentForm.tsx - Payment form component</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📦 Packages Installed</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>@stripe/stripe-js - Stripe.js for frontend</li>
                <li>@stripe/react-stripe-js - React Stripe components</li>
                <li>stripe - Node.js Stripe SDK</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🔧 Next Steps</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Add the payment form to your invoices or checkout pages</li>
                <li>
                  Set up a backend API endpoint (using Express, Supabase Edge Functions, etc.)
                </li>
                <li>Configure Stripe webhooks for payment confirmations</li>
                <li>Test with Stripe test cards before going live</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">💳 Test Cards</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>
                  <strong>Success:</strong> 4242 4242 4242 4242
                </p>
                <p>
                  <strong>Requires Auth:</strong> 4000 0025 0000 3155
                </p>
                <p>
                  <strong>Declined:</strong> 4000 0000 0000 0002
                </p>
                <p className="text-xs mt-2">Use any future date for expiry, any 3 digits for CVC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
