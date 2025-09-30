import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';

type Profile = {
  id: string;
  name: string;
  role: 'admin' | 'client';
};

export default function Account() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error(error);
        toast.error('Failed to load profile');
        setLoading(false);
        return;
      }

      setProfile(data);

      if (data?.role === 'client') {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        setProjects(projectsData || []);

        const { data: subsData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', data.id);
        setSubscriptions(subsData || []);

        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', data.id)
          .order('due_date', { ascending: false });
        setInvoices(invoicesData || []);
      } else if (data?.role === 'admin') {
        const { data: clientsData } = await supabase.from('clients').select('*');
        setClients(clientsData || []);
        
        const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLeads(leadsData || []);
      }

      setLoading(false);
    }
    loadProfile();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading account..." />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Layout>
      <SEO 
        title="Account | Dolonia Cloud"
        description="Manage your Dolonia Cloud account"
      />
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-bright">Account Dashboard</h1>
          <Button
            onClick={signOut}
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>

        <Card className="mb-8 bg-ocean-mid border-ocean-surface">
          <CardHeader>
            <CardTitle className="text-cyan-bright">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-foreground"><strong>Name:</strong> {profile.name || 'Not set'}</p>
            <p className="text-foreground">
              <strong>Role:</strong>{' '}
              <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                {profile.role}
              </Badge>
            </p>
          </CardContent>
        </Card>

        {profile.role === 'client' && (
          <div className="space-y-8">
            <Card className="bg-ocean-mid border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-cyan-bright">My Projects</CardTitle>
                <CardDescription>View your active projects</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <ul className="space-y-3">
                    {projects.map((p) => (
                      <li
                        key={p.id}
                        className="p-4 border border-ocean-surface rounded-lg bg-ocean-deep flex justify-between items-center"
                      >
                        <span className="text-foreground font-medium">{p.name}</span>
                        <Badge variant="outline">{p.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No projects yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-ocean-mid border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Subscription</CardTitle>
                <CardDescription>Your current subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length > 0 ? (
                  <ul className="space-y-3">
                    {subscriptions.map((s) => (
                      <li key={s.id} className="p-4 border border-ocean-surface rounded-lg bg-ocean-deep">
                        <p className="text-foreground"><strong>Plan:</strong> {s.plan}</p>
                        <p className="text-foreground"><strong>Status:</strong> {s.status}</p>
                        {s.current_period_end && (
                          <p className="text-foreground">
                            <strong>Next Billing:</strong>{' '}
                            {new Date(s.current_period_end).toLocaleDateString()}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No active subscription.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-ocean-mid border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Invoices</CardTitle>
                <CardDescription>Your billing history</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell>{new Date(i.due_date).toLocaleDateString()}</TableCell>
                          <TableCell>${i.amount}</TableCell>
                          <TableCell>
                            <Badge variant={i.status === 'paid' ? 'default' : 'secondary'}>
                              {i.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No invoices found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {profile.role === 'admin' && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-ocean-mid border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Clients</CardTitle>
                <CardDescription>Manage your clients</CardDescription>
              </CardHeader>
              <CardContent>
                {clients.length > 0 ? (
                  <ul className="space-y-3">
                    {clients.map((c) => (
                      <li key={c.id} className="p-4 border border-ocean-surface rounded-lg bg-ocean-deep">
                        <p className="font-bold text-foreground">{c.company}</p>
                        {c.phone && <p className="text-sm text-muted-foreground">{c.phone}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No clients found.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-ocean-mid border-ocean-surface">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Leads</CardTitle>
                <CardDescription>Recent contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {leads.length > 0 ? (
                  <ul className="space-y-3">
                    {leads.slice(0, 5).map((l) => (
                      <li key={l.id} className="p-4 border border-ocean-surface rounded-lg bg-ocean-deep">
                        <p className="font-bold text-foreground">
                          {l.name} ({l.email})
                        </p>
                        {l.message && (
                          <p className="text-sm text-muted-foreground mt-1">{l.message}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No leads yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
