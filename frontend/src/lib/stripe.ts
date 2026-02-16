import { loadStripe } from '@stripe/stripe-js'

// Load Stripe publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable')
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey)
