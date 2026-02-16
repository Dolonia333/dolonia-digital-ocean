import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from 'lovable-tagger'

// Payment intent middleware
function paymentMiddleware() {
  return {
    name: 'payment-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/create-payment-intent' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })
          req.on('end', async () => {
            try {
              const { amount, currency = 'usd', metadata } = JSON.parse(body)

              // Import Stripe dynamically (server-side only)
              const Stripe = (await import('stripe')).default
              const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
                apiVersion: '2024-11-20.acacia',
              })

              const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                metadata: metadata || {},
                automatic_payment_methods: { enabled: true },
              })

              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  clientSecret: paymentIntent.client_secret,
                  paymentIntentId: paymentIntent.id,
                }),
              )
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: error.message }))
            }
          })
        } else {
          next()
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // Use absolute paths for assets - fixes Docker/NAS deployment
  server: {
    host: 'localhost',
    port: 8080,
    allowedHosts: ['dolonia.cloud', 'Dolonia.cloud', 'www.dolonia.cloud', 'www.Dolonia.cloud', 'localhost', '127.0.0.1'],
    headers: {
      'Cache-Control': 'max-age=3600, public',
    },
    middlewareMode: false,
  },
  // CRITICAL: Disable source maps in dev to reduce memory by 1-2GB
  build: {
    sourcemap: false, // Disable source maps - huge memory savings
    minify: 'esbuild',
    outDir: 'dist',
    assetsDir: 'assets', // Explicit assets directory
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting to prevent multiple React instances
      },
    },
  },
  plugins: [react(), mode === 'development' && componentTagger(), paymentMiddleware()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'], // Force single React instance
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
  },
}))
