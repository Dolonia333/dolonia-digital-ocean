import { loadStripe, type Stripe } from '@stripe/stripe-js'

// Load Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Initialize Stripe - only on HTTPS (Stripe requires HTTPS for live keys)
export const stripePromise: Promise<Stripe | null> = (() => {
  if (!stripePublishableKey) {
    console.warn('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable')
    return Promise.resolve(null)
  }
  if (window.location.protocol !== 'https:') {
    console.warn('Stripe requires HTTPS for live integrations. Payment features are disabled over HTTP.')
    return Promise.resolve(null)
  }
  return loadStripe(stripePublishableKey)
})()
