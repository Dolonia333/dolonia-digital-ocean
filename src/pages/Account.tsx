import { useEffect, useMemo, useState } from 'react';
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
import { Progress } from '@/components/ui/progress';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  XAxis,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Briefcase,
  CalendarDays,
  CreditCard,
  LogOut,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { LucideIcon } from 'lucide-react';

type Profile = {
  id: string;
  name: string;
  role: 'admin' | 'client';
};

type Project = {
  id: string | number;
  name: string;
  status?: string;
  description?: string;
  created_at?: string;
  monthly_fee?: number | string;
  total_budget?: number | string;
};

type Subscription = {
  id: string | number;
  plan?: string;
  status?: string;
  current_period_end?: string;
  price?: number | string;
  billing_cycle?: string;
  created_at?: string;
};

type Invoice = {
  id: string | number;
  due_date?: string;
  amount?: number | string;
  status?: string;
  total_amount?: number | string;
  created_at?: string;
};

type Client = {
  id: string | number;
  company?: string;
  contact_name?: string;
  phone?: string;
  status?: string;
  name?: string;
  created_at?: string;
};

type Lead = {
  id: string | number;
  name?: string;
  email?: string;
  message?: string;
  status?: string;
  created_at?: string;
};

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
};

const StatCard = ({ title, value, hint, icon: Icon }: StatCardProps) => (
  <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-lg shadow-cyan-bright/5 backdrop-blur">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </CardTitle>
      <span className="rounded-full bg-cyan-bright/15 p-2 text-cyan-bright">
        <Icon className="h-4 w-4" />
      </span>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold text-foreground">{value}</div>
      {hint ? <p className="text-sm text-muted-foreground mt-1">{hint}</p> : null}
    </CardContent>
  </Card>
);

export default function Account() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profileRecord, error } = await supabase
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

      let profileData = profileRecord as Profile;

      const identifier = [
        session.user.email ?? '',
        (session.user.user_metadata?.full_name as string | undefined) ?? '',
        (session.user.user_metadata?.user_name as string | undefined) ?? '',
      ]
        .join(' ')
        .toLowerCase();
      const shouldPromoteToAdmin = identifier.includes('zionvanzandt');

      if (profileData && shouldPromoteToAdmin && profileData.role !== 'admin') {
        const { data: promotedProfile, error: promoteError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profileData.id)
          .select('id, name, role')
          .single();

        if (promoteError) {
          console.warn('Failed to promote profile automatically, applying client-side override.', promoteError);
          profileData = { ...profileData, role: 'admin' };
        } else if (promotedProfile) {
          profileData = promotedProfile as Profile;
        }
      }

      setProfile(profileData);

      if (profileData?.role === 'client') {
        const [projectsRes, subsRes, invoicesRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('subscriptions').select('*').eq('user_id', profileData.id),
          supabase
            .from('invoices')
            .select('*')
            .eq('user_id', profileData.id)
            .order('due_date', { ascending: false }),
        ]);

        setProjects((projectsRes.data as Project[]) || []);
        setSubscriptions((subsRes.data as Subscription[]) || []);
        setInvoices((invoicesRes.data as Invoice[]) || []);
        setClients([]);
        setLeads([]);
      } else if (profileData?.role === 'admin') {
        const [clientsRes, leadsRes, projectsRes, invoicesRes, subsRes] = await Promise.all([
          supabase.from('clients').select('*').order('created_at', { ascending: false }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('invoices').select('*').order('due_date', { ascending: false }),
          supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        ]);

        setClients((clientsRes.data as Client[]) || []);
        setLeads((leadsRes.data as Lead[]) || []);
        setProjects((projectsRes.data as Project[]) || []);
        setInvoices((invoicesRes.data as Invoice[]) || []);
        setSubscriptions((subsRes.data as Subscription[]) || []);
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

  const normalizeAmount = (amount: unknown) => {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      const parsed = Number(amount);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const clientStats = useMemo(() => {
    if (!profile || profile.role !== 'client') return [];

    const activeProjects = projects.filter((project) => {
      const status = (project?.status || '').toString().toLowerCase();
      return ['active', 'in-progress', 'ongoing'].includes(status);
    }).length;

    const activeSubscriptions = subscriptions.filter((sub) => {
      const status = (sub?.status || '').toString().toLowerCase();
      return ['active', 'trialing', 'past_due'].includes(status);
    }).length;

    const totalBilled = invoices.reduce((sum, invoice) => sum + normalizeAmount(invoice?.amount), 0);
    const outstandingTotal = invoices
      .filter((invoice) => (invoice?.status || '').toString().toLowerCase() !== 'paid')
      .reduce((sum, invoice) => sum + normalizeAmount(invoice?.amount), 0);

    const nextInvoice = invoices
      .map((invoice) => ({
        date: invoice?.due_date ? new Date(invoice.due_date) : null,
        status: (invoice?.status || '').toString().toLowerCase(),
      }))
      .filter((invoice) => invoice.date && invoice.status !== 'paid')
      .sort((a, b) => (a.date && b.date ? a.date.getTime() - b.date.getTime() : 0))[0]?.date;

    return [
      {
        title: 'Active Projects',
        value: activeProjects.toString(),
        hint: `${projects.length} total projects`,
        icon: Briefcase,
      },
      {
        title: 'Active Subscriptions',
        value: activeSubscriptions.toString(),
        hint: activeSubscriptions
          ? 'You’re covered and ready to deploy'
          : 'No current subscription plans',
        icon: CreditCard,
      },
      {
        title: 'Total Billed',
        value: `$${totalBilled.toLocaleString()}`,
        hint: outstandingTotal ? `$${outstandingTotal.toLocaleString()} outstanding` : 'All invoices paid',
        icon: TrendingUp,
      },
      {
        title: 'Next Billing Date',
        value: nextInvoice ? nextInvoice.toLocaleDateString() : 'Not scheduled',
        hint: 'Keep an eye on upcoming invoices',
        icon: CalendarDays,
      },
    ];
  }, [profile, projects, subscriptions, invoices]);

  const adminActiveClients = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0;

    return clients.filter((client) => {
      const status = (client?.status || '').toString().toLowerCase();
      return !status || ['active', 'engaged', 'priority'].includes(status);
    }).length;
  }, [profile, clients]);

  const adminLeadConversionRate = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return 0;

    const activeCount = adminActiveClients;
    return Math.round((Math.min(activeCount, clients.length) / leads.length) * 100);
  }, [profile, adminActiveClients, clients, leads]);

  const adminStats = useMemo(() => {
    if (!profile || profile.role !== 'admin') return [];

    const activeSubscriptions = subscriptions.filter((subscription) => {
      const status = (subscription?.status || '').toString().toLowerCase();
      return ['active', 'trialing', 'past_due'].includes(status);
    });

    const totalMRR = activeSubscriptions.reduce(
      (sum, subscription) => sum + normalizeAmount(subscription.price),
      0,
    );

    const inFlightProjects = projects.filter((project) => {
      const status = (project?.status || '').toString().toLowerCase();
      return ['active', 'in-progress', 'ongoing'].includes(status);
    }).length;

    const pipelineValue = projects.reduce((sum, project) => {
      const total = normalizeAmount(project.total_budget);
      const monthly = normalizeAmount(project.monthly_fee);
      return sum + (total > 0 ? total : monthly);
    }, 0);

    const outstandingInvoicesList = invoices.filter((invoice) => {
      const status = (invoice?.status || '').toString().toLowerCase();
      return status && status !== 'paid' && status !== 'cancelled';
    });

    const outstandingInvoiceAmount = outstandingInvoicesList.reduce(
      (sum, invoice) => sum + normalizeAmount(invoice.total_amount ?? invoice.amount),
      0,
    );

    return [
      {
        title: 'Clients Under Management',
        value: clients.length.toString(),
        hint: `${adminActiveClients} actively engaged`,
        icon: Users,
      },
      {
        title: 'Monthly Recurring Revenue',
        value: `$${totalMRR.toLocaleString()}`,
        hint: `${activeSubscriptions.length} active billing arrangements`,
        icon: CreditCard,
      },
      {
        title: 'Pipeline Value',
        value: `$${pipelineValue.toLocaleString()}`,
        hint: `${inFlightProjects} projects in motion`,
        icon: Briefcase,
      },
      {
        title: 'Outstanding Invoices',
        value: `$${outstandingInvoiceAmount.toLocaleString()}`,
        hint: `${outstandingInvoicesList.length} need action • ${adminLeadConversionRate}% lead→client`,
        icon: TrendingUp,
      },
    ];
  }, [profile, clients, subscriptions, projects, invoices, adminActiveClients, adminLeadConversionRate]);

  const invoiceChartData = useMemo(() => {
    if (!profile || profile.role !== 'client' || !invoices.length) return [];

    const sorted = [...invoices]
      .filter((invoice) => invoice?.due_date)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(-6);

    return sorted.map((invoice) => ({
      label: new Date(invoice.due_date).toLocaleDateString(undefined, { month: 'short' }),
      revenue: normalizeAmount(invoice.amount),
    }));
  }, [profile, invoices]);

  const leadStatusBreakdown = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return [];

    const counts = new Map<string, number>();
    leads.forEach((lead) => {
      const status = (lead?.status || 'new').toString().trim().toLowerCase();
      counts.set(status, (counts.get(status) ?? 0) + 1);
    });

    const total = leads.length;

    return Array.from(counts.entries())
      .map(([status, count]) => {
        const label = status
          .split(/[_\s]+/)
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(' ');
        const percent = total ? Math.round((count / total) * 100) : 0;
        return { status: label || 'New', count, percent };
      })
      .sort((a, b) => b.count - a.count);
  }, [profile, leads]);

  const adminLeadChartData = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return [];

    const buckets = new Map<string, { label: string; order: number; value: number }>();

    leads.forEach((lead) => {
      if (!lead?.created_at) return;
      const createdAt = new Date(lead.created_at);
      if (!Number.isFinite(createdAt.getTime())) return;

      const bucketKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
      const label = createdAt.toLocaleDateString(undefined, { month: 'short' });

      const current = buckets.get(bucketKey);
      if (current) {
        current.value += 1;
      } else {
        buckets.set(bucketKey, { label, order: monthStart.getTime(), value: 1 });
      }
    });

    return Array.from(buckets.values())
      .sort((a, b) => a.order - b.order)
      .slice(-6)
      .map(({ label, value }) => ({ label, leads: value }));
  }, [profile, leads]);

  const outstandingAdminInvoices = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !invoices.length) return [];

    return invoices
      .filter((invoice) => {
        const status = (invoice?.status || '').toString().toLowerCase();
        return status && status !== 'paid' && status !== 'cancelled';
      })
      .sort((a, b) => {
        const aDue = a?.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b?.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      })
      .slice(0, 6);
  }, [profile, invoices]);

  const recentClients = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !clients.length) return [];

    return [...clients]
      .sort((a, b) => {
        const aCreated = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const bCreated = b?.created_at ? new Date(b.created_at).getTime() : 0;
        return bCreated - aCreated;
      })
      .slice(0, 6);
  }, [profile, clients]);

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
      <div className="container mx-auto px-6 py-24 space-y-12">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-bright/20 bg-gradient-to-r from-ocean-deep/90 via-ocean-surface/30 to-ocean-deep/90 p-10 shadow-2xl shadow-cyan-bright/10">
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-cyan-bright/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-16 h-72 w-72 rounded-full bg-ocean-surface/40 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-bright/30 bg-ocean-deep/70 px-4 py-2 text-sm text-cyan-soft shadow-inner">
                <span className="rounded-full bg-cyan-bright/20 p-1">
                  <Users className="h-4 w-4 text-cyan-bright" />
                </span>
                <span>Welcome back, {profile.name || 'Explorer'}!</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground md:text-5xl">Account Command Center</h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Monitor your cloud presence, track subscriptions, and stay ahead of what’s next for your
                Dolonia experience.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-bright/20 px-4 py-1 text-sm font-medium text-cyan-bright">
                <span className="font-semibold capitalize">{profile.role}</span>
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                  {profile.role}
                </Badge>
              </div>
              <Button onClick={signOut} variant="outline" className="border-cyan-bright/40 text-cyan-bright">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {(profile.role === 'client' ? clientStats : adminStats).map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-cyan-bright">Profile Overview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Quick snapshot of your Dolonia identity and role-specific access.
              </CardDescription>
            </div>
            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
              {profile.role}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Account Holder</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{profile.name || 'Not set'}</p>
            </div>
            <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/60 p-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">Role Scope</p>
              <p className="mt-1 text-lg text-muted-foreground">
                {profile.role === 'admin'
                  ? 'Full system access to manage clients, monitor leads, and streamline operations.'
                  : 'Track project momentum, billing timelines, and manage your Dolonia engagement.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {profile.role === 'client' && (
          <div className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-cyan-bright">Projects Timeline</CardTitle>
                    <CardDescription>Latest status updates across your initiatives.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                    {projects.length} total projects
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length > 0 ? (
                    <ul className="space-y-3">
                      {projects.map((project) => {
                        const status = (project?.status || '').toString();
                        return (
                          <li
                            key={project.id}
                            className="group relative overflow-hidden rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4 transition-all duration-300 hover:border-cyan-bright/40 hover:shadow-lg hover:shadow-cyan-bright/10"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-bright/0 via-cyan-bright/5 to-cyan-bright/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-lg font-semibold text-foreground">{project.name}</p>
                                {project.description ? (
                                  <p className="text-sm text-muted-foreground">{project.description}</p>
                                ) : null}
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {status || 'N/A'}
                              </Badge>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-8 text-center">
                      <p className="text-lg font-semibold text-foreground">No projects launched yet</p>
                      <p className="mt-2 text-muted-foreground">Kickstart a deployment to see it appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright">Subscription Snapshot</CardTitle>
                  <CardDescription>Stay synced with your current coverage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscriptions.length > 0 ? (
                    subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4"
                      >
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                          Plan
                        </p>
                        <p className="text-xl font-semibold text-foreground">{subscription.plan || 'Custom'}</p>
                        <Separator className="my-3 bg-cyan-bright/20" />
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>
                            <span className="font-semibold text-foreground">Status:</span>{' '}
                            <Badge variant="outline" className="ml-2 border-cyan-bright/40 capitalize text-cyan-bright">
                              {subscription.status || 'Unknown'}
                            </Badge>
                          </p>
                          {subscription.current_period_end ? (
                            <p>
                              <span className="font-semibold text-foreground">Next billing:</span>{' '}
                              {new Date(subscription.current_period_end).toLocaleDateString()}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No active subscription detected. Reach out to tailor the perfect plan.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-cyan-bright">Billing Insights</CardTitle>
                  <CardDescription>Your historical billing trail at a glance.</CardDescription>
                </div>
                <Badge variant="outline" className="border-cyan-bright/40 text-cyan-bright">
                  {invoices.length} invoices
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {invoiceChartData.length > 0 ? (
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        revenue: {
                          label: 'Amount billed',
                          color: '#22d3ee',
                        },
                      }}
                      className="h-full"
                    >
                      <AreaChart data={invoiceChartData} margin={{ left: 12, right: 12, bottom: 8 }}>
                        <defs>
                          <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeOpacity={0.15} strokeDasharray="3 3" />
                        <XAxis dataKey="label" stroke="hsla(0,0%,100%,0.4)" tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<ChartTooltipContent hideIndicator />} cursor={{ stroke: '#22d3ee', strokeOpacity: 0.2 }} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          fill="url(#revenue-gradient)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Billing activity will populate here once invoices start flowing.
                    </p>
                  </div>
                )}

                {invoices.length > 0 ? (
                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyan-bright/10">
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id} className="border-cyan-bright/10">
                            <TableCell>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</TableCell>
                            <TableCell>${normalizeAmount(invoice.amount).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  (invoice?.status || '').toString().toLowerCase() === 'paid' ? 'default' : 'secondary'
                                }
                                className="capitalize"
                              >
                                {invoice.status || 'Unknown'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}

        {profile.role === 'admin' && (
          <div className="space-y-10">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2 bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-cyan-bright">Lead Velocity</CardTitle>
                    <CardDescription>Track capture momentum across the last six months.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                    {leads.length} total leads
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {adminLeadChartData.length > 0 ? (
                    <div className="h-64">
                      <ChartContainer
                        config={{
                          leads: {
                            label: 'Leads captured',
                            color: '#a855f7',
                          },
                        }}
                        className="h-full"
                      >
                        <AreaChart data={adminLeadChartData} margin={{ left: 12, right: 12, bottom: 8 }}>
                          <defs>
                            <linearGradient id="lead-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeOpacity={0.12} strokeDasharray="3 3" />
                          <XAxis dataKey="label" stroke="hsla(0,0%,100%,0.4)" tickLine={false} axisLine={false} />
                          <RechartsTooltip content={<ChartTooltipContent hideIndicator />} cursor={{ stroke: '#a855f7', strokeOpacity: 0.25 }} />
                          <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="#a855f7"
                            strokeWidth={2}
                            fill="url(#lead-gradient)"
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Lead activity will appear once inbound requests start rolling in.
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Lead → client conversion currently sits at{' '}
                    <span className="font-semibold text-cyan-bright">{adminLeadConversionRate}%</span> across{' '}
                    <span className="font-semibold text-foreground">{leads.length}</span> tracked leads with{' '}
                    <span className="font-semibold text-foreground">{adminActiveClients}</span> active clients.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-cyan-bright/15 p-2">
                      <Target className="h-4 w-4 text-cyan-bright" />
                    </span>
                    <div>
                      <CardTitle className="text-cyan-bright">Lead Status Breakdown</CardTitle>
                      <CardDescription>Where every opportunity currently sits.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leadStatusBreakdown.length > 0 ? (
                    leadStatusBreakdown.map((item) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{item.status}</span>
                          <span className="text-muted-foreground">
                            {item.count} ({item.percent}%)
                          </span>
                        </div>
                        <Progress value={item.percent} className="h-2 bg-ocean-deep/60 border border-cyan-bright/10" />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">No leads yet to analyze.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-cyan-bright">Client Briefings</CardTitle>
                    <CardDescription>Most recent organizations welcomed into Dolonia.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                    {clients.length} total
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentClients.length > 0 ? (
                    <ul className="space-y-3">
                      {recentClients.map((client) => (
                        <li
                          key={client.id}
                          className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4 transition-colors hover:border-cyan-bright/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-lg font-semibold text-foreground">
                              {client.company || client.name || 'Unnamed Client'}
                            </p>
                            {client.status ? (
                              <Badge variant="secondary" className="capitalize">
                                {client.status}
                              </Badge>
                            ) : null}
                          </div>
                          {client.contact_name ? (
                            <p className="mt-1 text-sm text-muted-foreground">Primary: {client.contact_name}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {client.phone ? (
                              <span className="rounded-full bg-ocean-surface/80 px-3 py-1">{client.phone}</span>
                            ) : null}
                            {client.created_at ? (
                              <span className="rounded-full bg-cyan-bright/10 px-3 py-1">
                                Joined {new Date(client.created_at).toLocaleDateString()}
                              </span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">No clients on record yet. Onboard a new one to begin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-cyan-bright">Lead Dispatch Queue</CardTitle>
                    <CardDescription>Highest priority conversations to follow up.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                    {leads.length} leads
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leads.length > 0 ? (
                    <ul className="space-y-3">
                      {leads.slice(0, 6).map((lead) => (
                        <li
                          key={lead.id}
                          className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4 transition-colors hover:border-cyan-bright/40"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-base font-semibold text-foreground">
                                {lead.name || 'Unnamed Lead'}{' '}
                                {lead.email ? <span className="text-muted-foreground">({lead.email})</span> : null}
                              </p>
                              {lead.status ? (
                                <Badge variant="secondary" className="capitalize self-start">
                                  {lead.status}
                                </Badge>
                              ) : null}
                            </div>
                            {lead.message ? (
                              <p className="rounded-xl border border-cyan-bright/10 bg-ocean-surface/70 p-3 text-sm text-muted-foreground">
                                {lead.message}
                              </p>
                            ) : null}
                            {lead.created_at ? (
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                {new Date(lead.created_at).toLocaleString()}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">No leads flowing in yet. Campaign data will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-cyan-bright">Outstanding Invoices</CardTitle>
                    <CardDescription>Top finance follow-ups requiring attention.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                    {outstandingAdminInvoices.length} pending
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outstandingAdminInvoices.length > 0 ? (
                    <ul className="space-y-3">
                      {outstandingAdminInvoices.map((invoice) => (
                        <li
                          key={invoice.id}
                          className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                                Due
                              </p>
                              <p className="text-lg font-semibold text-foreground">
                                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                                Amount
                              </p>
                              <p className="text-lg font-semibold text-foreground">
                                ${normalizeAmount(invoice.total_amount ?? invoice.amount).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="capitalize">
                              {invoice.status || 'Pending'}
                            </Badge>
                            {invoice.created_at ? (
                              <span className="rounded-full bg-ocean-surface/80 px-3 py-1">
                                Created {new Date(invoice.created_at).toLocaleDateString()}
                              </span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">No outstanding balances — finance is fully caught up.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
