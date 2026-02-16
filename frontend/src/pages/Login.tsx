import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import SEO from '@/components/SEO'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
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
      <SEO
        title="Login | DOLONIA DATA TECH"
        description="Sign in to your DOLONIA DATA TECH account"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-ocean p-4">
        <Card className="w-full max-w-md bg-ocean-mid border-ocean-surface">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-cyan-bright">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-cyan-soft">
              {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-soft">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="bg-ocean-deep border-ocean-surface text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-soft">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="bg-ocean-deep border-ocean-surface text-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep transition-all"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-cyan-soft hover:text-cyan-bright transition-colors text-sm"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-cyan-soft hover:text-cyan-bright transition-colors text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
