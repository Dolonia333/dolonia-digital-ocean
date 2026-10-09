import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import SEO from '@/components/SEO'
import OceanIntro from '@/components/OceanIntro'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [entered, setEntered] = useState(false)
  const navigate = useNavigate()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
          },
        })
        if (error) throw error

        // Clear any cached profile data from previous sessions
        localStorage.removeItem('userProfile')

        // If email confirmation is disabled, auto sign-in
        if (data.session) {
          toast.success('Account created successfully!')
          navigate('/account')
        } else {
          toast.success('Account created! Please check your email to confirm.')
        }
      } else {
        // Clear cached profile before signing in to prevent stale data
        localStorage.removeItem('userProfile')

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Signed in successfully!')
        navigate('/account')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Login | Dolonia Data Tech" description="Sign in to the dashboard." noIndex />
      {entered ? null : <OceanIntro onDone={() => setEntered(true)} />}
      <div
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16"
        style={{
          background:
            'linear-gradient(180deg, #1b587e 0%, #0e3a5c 28%, #07223d 58%, #041a2c 100%)',
        }}
      >
        <div className="w-full max-w-md border border-[var(--line)] bg-[rgba(4,26,44,0.55)] p-8 backdrop-blur-sm">
          <p className="ocean-kicker">Tools</p>
          <h1 className="ocean-display mt-3 text-5xl">
            {isSignUp ? 'Create an account' : 'Sign in'}
          </h1>
          <p className="mt-4 text-[var(--soft)]">
            {isSignUp
              ? 'Use this for invoices, bookings, and intake.'
              : 'Invoices, calendar, intake, and tickets are in here.'}
          </p>
          <form onSubmit={handleAuth} className="mt-8 space-y-5">
            <div>
              <label className="ocean-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="ocean-field"
              />
            </div>
            <div>
              <label className="ocean-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={6}
                className="ocean-field"
              />
            </div>
            <button type="submit" disabled={loading} className="ocean-btn w-full">
              <i className="bc tl" />
              <i className="bc tr" />
              <i className="bc br" />
              <i className="bc bl" />
              {loading ? 'Loading' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ocean-link text-left">
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
            <Link to="/" className="ocean-link">
              Back to the surface
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
