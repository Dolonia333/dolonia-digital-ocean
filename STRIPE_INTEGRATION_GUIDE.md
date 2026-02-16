# Stripe Payment Integration Guide

## ✅ Setup Complete!

Your Stripe payment integration is now fully configured and ready to use.

## 📁 Files Created

### 1. **Configuration**

- `src/lib/stripe.ts` - Stripe client initialization for frontend
- `src/server/stripe.ts` - Server-side Stripe SDK functions
- `src/server/stripe-api.ts` - API handlers for payment operations

### 2. **Components**

- `src/components/StripePaymentForm.tsx` - Complete payment form with Stripe Elements
- `src/pages/PaymentExample.tsx` - Example page showing how to use payments

### 3. **Environment Variables**

Already added to `.env.local`:

```
VITE_STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🚀 How to Use

### Basic Payment Form

```tsx
import { StripePaymentForm } from '@/components/StripePaymentForm'

function MyCheckout() {
  return (
    <StripePaymentForm
      amount={99.99}
      currency="usd"
      description="Product Purchase"
      onSuccess={() => console.log('Payment successful!')}
      onError={(error) => console.error('Payment failed:', error)}
    />
  )
}
```

### Create Payment Intent Manually

```tsx
import { handleCreatePaymentIntent } from '@/server/stripe-api'

const result = await handleCreatePaymentIntent(
  99.99, // amount in dollars
  'usd', // currency
  { orderId: '12345' }, // metadata
)

console.log(result.clientSecret) // Use this with Stripe Elements
```

### Create Customer

```tsx
import { handleCreateCustomer } from '@/server/stripe-api'

const result = await handleCreateCustomer('customer@example.com', 'John Doe', {
  userId: 'user_123',
})

console.log(result.customerId) // Save this to your database
```

### Create Subscription

```tsx
import { handleCreateSubscription } from '@/server/stripe-api'

const result = await handleCreateSubscription(
  'cus_xxxxx', // Stripe customer ID
  'price_xxxxx', // Stripe price ID
  { planName: 'Premium' },
)

console.log(result.subscriptionId)
```

## 🧪 Testing

### Test Payment Page

Visit: `http://localhost:8080/payment-example`

### Test Cards

- **Success**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

## 🔐 Security Notes

### ⚠️ IMPORTANT - Live Keys

You're currently using **LIVE** Stripe keys (`sk_live_` and `pk_live_`). This means:

- Real money will be charged
- Real customers will be created
- Real subscriptions will be active

### For Development

Consider switching to test keys:

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your test keys (they start with `sk_test_` and `pk_test_`)
3. Update `.env.local` with test keys for development

### Production Deployment

When deploying to production:

1. Add your Stripe keys to your hosting platform's environment variables
2. **NEVER** commit `.env.local` to git (it's already in `.gitignore`)
3. Set up Stripe webhooks for production events

## 🔄 Webhook Integration

### Setup Webhooks (Recommended for Production)

1. **In Stripe Dashboard**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Select events: `payment_intent.succeeded`, `customer.subscription.created`, etc.

2. **Create Webhook Handler** (example with Express):

```typescript
import express from 'express'
import { stripe } from './src/server/stripe'
import { handleStripeWebhook } from './src/server/stripe-api'

const app = express()

app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

    await handleStripeWebhook(
      event,
      async (paymentIntent) => {
        // Handle successful payment
        console.log('Payment succeeded:', paymentIntent.id)
        // Update your database, send confirmation email, etc.
      },
      async (subscription) => {
        // Handle new subscription
        console.log('Subscription created:', subscription.id)
        // Grant access to subscription features
      },
    )

    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})
```

## 💡 Integration Examples

### Add to Invoice Payment

```tsx
// In your invoice page
import { StripePaymentForm } from '@/components/StripePaymentForm'

;<StripePaymentForm
  amount={invoice.totalAmount}
  currency="usd"
  description={`Invoice #${invoice.number}`}
  metadata={{
    invoiceId: invoice.id,
    customerId: invoice.customerId,
  }}
  onSuccess={async () => {
    // Update invoice status in Supabase
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoice.id)

    toast.success('Invoice paid successfully!')
  }}
/>
```

### Save Customer for Future Payments

```tsx
import { handleCreateCustomer } from '@/server/stripe-api'
import { supabase } from '@/integrations/supabase/client'

async function saveCustomer(userId: string, email: string, name: string) {
  // Create Stripe customer
  const { customerId } = await handleCreateCustomer(email, name, { userId })

  // Save to your database
  await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', userId)

  return customerId
}
```

## 📊 Available Functions

### Payment Functions

- `createPaymentIntent(amount, currency, metadata)` - One-time payment
- `retrievePaymentIntent(paymentIntentId)` - Get payment status

### Customer Functions

- `createCustomer(email, name, metadata)` - Create customer
- `stripe.customers.retrieve(customerId)` - Get customer
- `stripe.customers.update(customerId, data)` - Update customer

### Subscription Functions

- `createSubscription(customerId, priceId, metadata)` - Start subscription
- `cancelSubscription(subscriptionId)` - Cancel subscription
- `stripe.subscriptions.update(subscriptionId, data)` - Update subscription

## 🛠️ Next Steps

1. **Test the integration**: Visit `/payment-example` and make a test payment
2. **Integrate with your pages**: Add `<StripePaymentForm />` to invoice or checkout pages
3. **Set up webhooks**: Configure production webhooks for event handling
4. **Add customer management**: Store Stripe customer IDs in your database
5. **Create subscription plans**: Set up products and prices in Stripe dashboard
6. **Switch to test keys**: Use test keys for development

## 📚 Resources

- [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)

## 🆘 Troubleshooting

### Payment form not loading?

- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Stripe packages are installed: `npm install`

### "Failed to create payment intent" error?

- Check that `VITE_STRIPE_SECRET_KEY` is set in `.env.local`
- Verify the secret key is valid in Stripe dashboard
- Check browser network tab for detailed error messages

### Payments not processing?

- Verify you're using test cards in test mode
- Check Stripe dashboard for payment logs
- Ensure webhook handlers are properly configured

## 💰 Pricing & Fees

Stripe charges per successful transaction:

- **2.9% + $0.30** for US cards
- **3.9% + $0.30** for international cards
- **0.8%** for subscriptions (additional)

Visit [Stripe Pricing](https://stripe.com/pricing) for details.

---

**Integration completed on:** $(date)
**Stripe API Version:** 2024-12-18.acacia
