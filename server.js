import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = express()
const port = 3001

// Validate Stripe key
if (!process.env.VITE_STRIPE_SECRET_KEY) {
  console.error('ERROR: VITE_STRIPE_SECRET_KEY is not set in .env.local')
  process.exit(1)
}

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
})

console.log('Stripe initialized successfully')

// Middleware
app.use(cors())
app.use(express.json())

// Create payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Return client secret
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      error: error.message || 'Failed to create payment intent',
    })
  }
})

app.listen(port, () => {
  console.log(`Payment server running on http://localhost:${port}`)
})
