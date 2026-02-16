import { createPaymentIntent, createCustomer, createSubscription } from './stripe'
import Stripe from 'stripe'

/**
 * API Handler for creating payment intents
 * This should be called from your frontend to create a payment intent
 */
export async function handleCreatePaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>,
) {
  try {
    const paymentIntent = await createPaymentIntent(amount, currency, metadata)

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    throw new Error('Failed to create payment intent')
  }
}

/**
 * API Handler for creating customers
 */
export async function handleCreateCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>,
) {
  try {
    const customer = await createCustomer(email, name, metadata)

    return {
      customerId: customer.id,
      customer,
    }
  } catch (error) {
    console.error('Customer creation failed:', error)
    throw new Error('Failed to create customer')
  }
}

/**
 * API Handler for creating subscriptions
 */
export async function handleCreateSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>,
) {
  try {
    const subscription = await createSubscription(customerId, priceId, metadata)

    // Extract client secret from the subscription
    const latestInvoice = subscription.latest_invoice as unknown
    const paymentIntent = (latestInvoice as { payment_intent?: unknown })?.payment_intent
    const clientSecret = (paymentIntent as { client_secret?: string | null })?.client_secret || null

    return {
      subscriptionId: subscription.id,
      clientSecret,
      subscription,
    }
  } catch (error) {
    console.error('Subscription creation failed:', error)
    throw new Error('Failed to create subscription')
  }
}

/**
 * Webhook handler for Stripe events
 * Use this to handle payment confirmations, subscription updates, etc.
 */
export async function handleStripeWebhook(
  event: Stripe.Event,
  onPaymentSuccess?: (paymentIntent: Stripe.PaymentIntent) => Promise<void>,
  onSubscriptionCreated?: (subscription: Stripe.Subscription) => Promise<void>,
) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id)
      if (onPaymentSuccess) {
        await onPaymentSuccess(event.data.object as Stripe.PaymentIntent)
      }
      break

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id)
      break

    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object.id)
      if (onSubscriptionCreated) {
        await onSubscriptionCreated(event.data.object as Stripe.Subscription)
      }
      break

    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object.id)
      break

    case 'customer.subscription.deleted':
      console.log('Subscription canceled:', event.data.object.id)
      break

    default:
      console.log('Unhandled event type:', event.type)
  }
}
