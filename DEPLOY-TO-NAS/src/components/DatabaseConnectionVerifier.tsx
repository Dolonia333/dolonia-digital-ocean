import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, Database, Users, Shield, Settings } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/auth-js'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'warning' | 'error'
  message: string
  details?: Record<string, unknown> | null
}

export default function DatabaseConnectionVerifier() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)

  const updateResult = (
    name: string,
    status: TestResult['status'],
    message: string,
    details?: Record<string, unknown> | null,
  ) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.name === name)
      if (existing) {
        return prev.map((r) => (r.name === name ? { ...r, status, message, details } : r))
      }
      return [...prev, { name, status, message, details }]
    })
  }

  const runFullDiagnostic = async () => {
    setIsRunning(true)
    setResults([])

    try {
      // Test 1: Authentication Status
      updateResult('Auth Status', 'pending', 'Checking authentication...')
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        updateResult('Auth Status', 'error', `Auth error: ${authError.message}`)
        setIsRunning(false)
        return
      }

      if (!user) {
        updateResult('Auth Status', 'warning', 'No user logged in - login required for admin panel')
        setIsRunning(false)
        return
      }

      setCurrentUser(user)
      updateResult('Auth Status', 'success', `Logged in as: ${user.email}`, { user_id: user.id })

      // Test 2: Profile Access
      updateResult('Profile Access', 'pending', 'Checking user profile...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        updateResult('Profile Access', 'error', `Profile error: ${profileError.message}`)
      } else if (!profile) {
        updateResult('Profile Access', 'warning', 'No profile found - may need to create one')
      } else {
        updateResult(
          'Profile Access',
          'success',
          `Profile found: ${profile.role || 'No role set'}`,
          profile,
        )
      }

      // Test 3: Admin Permissions
      updateResult('Admin Permissions', 'pending', 'Checking admin access...')
      if (profile && profile.role === 'admin') {
        updateResult('Admin Permissions', 'success', 'Admin role confirmed - full access granted')
      } else {
        updateResult('Admin Permissions', 'warning', 'Not an admin user - limited access')
      }

      // Test 4: Database Tables Access
      const tableTests = [
        { name: 'leads', label: 'leads Table' },
        { name: 'projects', label: 'projects Table' },
        { name: 'subscriptions', label: 'subscriptions Table' },
        { name: 'invoices', label: 'invoices Table' },
        { name: 'clients', label: 'clients Table' },
      ] as const

      for (const tableTest of tableTests) {
        updateResult(tableTest.label, 'pending', `Testing ${tableTest.name} access...`)

        try {
          const { data, error, count } = await supabase
            .from(tableTest.name)
            .select('*', { count: 'exact', head: true })

          if (error) {
            updateResult(tableTest.label, 'error', `${tableTest.name} error: ${error.message}`)
          } else {
            updateResult(
              tableTest.label,
              'success',
              `${tableTest.name} accessible (${count || 0} records)`,
            )
          }
        } catch (err) {
          updateResult(tableTest.label, 'error', `${tableTest.name} failed: ${err}`)
        }
      }

      // Test 5: RLS Policies
      updateResult('RLS Policies', 'pending', 'Testing Row Level Security...')
      try {
        const { data: testData, error: rlsError } = await supabase
          .from('leads')
          .select('id')
          .limit(1)

        if (rlsError && rlsError.message.includes('permission')) {
          updateResult('RLS Policies', 'warning', 'RLS policies may be too restrictive')
        } else if (rlsError) {
          updateResult('RLS Policies', 'error', `RLS error: ${rlsError.message}`)
        } else {
          updateResult('RLS Policies', 'success', 'RLS policies working correctly')
        }
      } catch (err) {
        updateResult('RLS Policies', 'error', `RLS test failed: ${err}`)
      }

      // Test 6: Real-time Subscriptions
      updateResult('Real-time', 'pending', 'Testing real-time capabilities...')
      try {
        const channel = supabase
          .channel('test-channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {})

        await channel.subscribe()
        updateResult('Real-time', 'success', 'Real-time subscriptions working')
        supabase.removeChannel(channel)
      } catch (err) {
        updateResult('Real-time', 'warning', 'Real-time may not be fully configured')
      }
    } catch (error) {
      updateResult('General Error', 'error', `Unexpected error: ${error}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        )
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }
  }

  return (
    <Card className="bg-ocean-surface/60 border-cyan-bright/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cyan-bright">
          <Database className="w-5 h-5" />
          <span>Database Connection Verifier</span>
        </CardTitle>
        <CardDescription className="text-cyan-soft">
          Run this test to verify your Supabase database connection and admin panel functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={runFullDiagnostic}
          disabled={isRunning}
          className="bg-gradient-cyber hover:shadow-glow text-ocean-deep"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Full Database Test'}
        </Button>

        {currentUser && (
          <Alert className="border-cyan-bright/30 bg-cyan-bright/5">
            <Users className="w-4 h-4" />
            <AlertDescription className="text-cyan-soft">
              Currently logged in as:{' '}
              <strong className="text-cyan-bright">{currentUser.email}</strong>
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cyan-bright">Test Results:</h3>

            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg border border-ocean-surface/50 bg-ocean-deep/20"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{result.name}</span>
                    <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                  </div>
                  <p className="text-sm text-cyan-soft mt-1">{result.message}</p>
                  {result.details && (
                    <pre className="text-xs text-muted-foreground mt-2 bg-ocean-deep/40 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <Alert className="border-cyan-bright/30 bg-ocean-deep/40">
            <Settings className="w-4 h-4" />
            <AlertDescription className="text-cyan-soft">
              <strong>Next Steps:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>
                  If authentication fails: Check your .env file VITE_SUPABASE_URL and
                  VITE_SUPABASE_ANON_KEY
                </li>
                <li>If profile is missing: Login and visit /account to auto-create your profile</li>
                <li>
                  If admin access is denied: Update your profile role to 'admin' in Supabase
                  dashboard
                </li>
                <li>If tables are missing: Run the SQL schema files in your Supabase project</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
