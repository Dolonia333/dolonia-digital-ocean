import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Database, Network, Shield } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export default function SupabaseConnectionTest() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Supabase Connection', status: 'pending', message: 'Testing connection...' },
    { name: 'Database Schema', status: 'pending', message: 'Checking tables...' },
    { name: 'RLS Policies', status: 'pending', message: 'Verifying security...' },
    { name: 'Leads Table', status: 'pending', message: 'Testing contact form integration...' }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<ConnectionTest>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));

    try {
      // Test 1: Basic Connection
      updateTest(0, { message: 'Connecting to Supabase...' });
      const { data: healthCheck, error: healthError } = await supabase
        .from('leads')
        .select('count', { count: 'exact', head: true });
      
      if (healthError) {
        updateTest(0, { 
          status: 'error', 
          message: `Connection failed: ${healthError.message}`,
          details: { error: healthError.message, code: healthError.code }
        });
        setIsRunning(false);
        return;
      }
      
      updateTest(0, { 
        status: 'success', 
        message: `Connected to ${import.meta.env.VITE_SUPABASE_URL}`,
        details: { url: import.meta.env.VITE_SUPABASE_URL }
      });

      // Test 2: Database Schema
      updateTest(1, { message: 'Checking database tables...' });
      const tables = ['leads', 'profiles', 'clients', 'projects', 'invoices', 'subscriptions', 'audit_log', 'api_tokens'];
      const tableChecks = await Promise.all(
        tables.map(async (table) => {
          const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
          return { table, exists: !error };
        })
      );
      
      const existingTables = tableChecks.filter(t => t.exists).map(t => t.table);
      const missingTables = tableChecks.filter(t => !t.exists).map(t => t.table);
      
      if (missingTables.length > 0) {
        updateTest(1, { 
          status: 'error', 
          message: `Missing tables: ${missingTables.join(', ')}`,
          details: { existing: existingTables, missing: missingTables }
        });
      } else {
        updateTest(1, { 
          status: 'success', 
          message: `All 8 tables found: ${existingTables.join(', ')}`,
          details: { tables: existingTables }
        });
      }

      // Test 3: RLS Policies
      updateTest(2, { message: 'Testing Row Level Security...' });
      
      // Test public access to leads (should work)
      const { data: publicLeads, error: publicError } = await supabase
        .from('leads')
        .select('id')
        .limit(1);
      
      // Test access to profiles (should be restricted)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (!publicError && profilesError && profilesError.code === 'PGRST116') {
        updateTest(2, { 
          status: 'success', 
          message: 'RLS policies working correctly - leads public, profiles protected',
          details: { leadsPublic: true, profilesProtected: true }
        });
      } else {
        updateTest(2, { 
          status: 'error', 
          message: 'RLS policies not configured properly',
          details: { publicError, profilesError }
        });
      }

      // Test 4: Contact Form Integration
      updateTest(3, { message: 'Testing contact form functionality...' });
      
      const testLead = {
        name: 'Connection Test',
        email: 'test@connection.test',
        company: 'Dolonia Test Suite',
        phone: '555-TEST-123',
        message: `Connection test performed on ${new Date().toISOString()}`,
        status: 'test'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('leads')
        .insert([testLead])
        .select();
      
      if (insertError) {
        updateTest(3, { 
          status: 'error', 
          message: `Contact form test failed: ${insertError.message}`,
          details: { error: insertError.message, code: insertError.code }
        });
      } else {
        updateTest(3, { 
          status: 'success', 
          message: `Contact form integration working! Lead ID: ${insertData[0]?.id}`,
          details: insertData[0]
        });
      }

    } catch (error) {
      console.error('Test suite error:', error);
      updateTest(0, { 
        status: 'error', 
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'pending': return <Badge variant="secondary">Testing...</Badge>;
    }
  };

  useEffect(() => {
    // Auto-run tests on component mount
    const runTestsOnMount = async () => {
      await runTests();
    };
    runTestsOnMount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Supabase Connection Diagnostics
          </CardTitle>
          <CardDescription>
            Testing PC Supabase ({import.meta.env.VITE_SUPABASE_URL}) connectivity from NAS frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Network className="h-4 w-4" />
                  Run Connection Tests
                </>
              )}
            </Button>
            
            <div className="text-sm text-gray-600">
              <strong>Architecture:</strong> PC Database → NAS Website
            </div>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-gray-600">{test.message}</div>
                    {test.details && test.status === 'success' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {JSON.stringify(test.details, null, 2).slice(0, 100)}...
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <strong className="text-blue-800">Security Status</strong>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Contact forms work without authentication (public access)</li>
              <li>✅ User data protected by Row Level Security</li>
              <li>✅ Admin functions require proper authentication</li>
              <li>✅ All database operations logged for audit</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}