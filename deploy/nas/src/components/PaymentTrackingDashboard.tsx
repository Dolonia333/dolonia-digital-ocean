import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  RefreshCw,
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

type Payment = {
  id: string
  invoice_id: string | null
  stripe_payment_intent_id: string
  stripe_charge_id: string | null
  amount: number
  currency: string
  status: string
  payment_method: string | null
  payment_method_type: string | null
  last_four: string | null
  card_brand: string | null
  customer_email: string | null
  failure_reason: string | null
  refund_amount: number
  created_at: string
  updated_at: string
}

type Invoice = {
  id: string
  invoice_number: string
  client_name: string
  client_email: string
  amount: number
  currency: string
  status: string
  description: string | null
}

type PaymentHistory = {
  id: string
  payment_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  change_reason: string | null
  created_at: string
}

type RevenueStats = {
  total_revenue: number
  total_refunds: number
  net_revenue: number
  successful_payments: number
  failed_payments: number
  currency: string
}

const COLORS = {
  succeeded: '#22c55e',
  failed: '#ef4444',
  processing: '#f59e0b',
  refunded: '#6366f1',
  cancelled: '#94a3b8',
}

const STATUS_COLORS: Record<string, string> = {
  succeeded: 'bg-green-500/20 text-green-400 border-green-500/50',
  failed: 'bg-red-500/20 text-red-400 border-red-500/50',
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}

export default function PaymentTrackingDashboard() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadPaymentData()
  }, [])

  async function loadPaymentData() {
    try {
      setLoading(true)

      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (paymentsError) throw paymentsError

      // Load payment history
      const { data: historyData, error: historyError } = await supabase
        .from('payment_history' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (historyError) throw historyError

      // Load revenue stats
      const { data: statsData, error: statsError } = await supabase
        .from('revenue_stats' as any)
        .select('*')
        .single()

      if (statsError && statsError.code !== 'PGRST116') throw statsError

      setPayments((paymentsData as unknown as Payment[]) || [])
      setPaymentHistory((historyData as unknown as PaymentHistory[]) || [])
      setRevenueStats((statsData as unknown as RevenueStats) || null)
    } catch (error) {
      console.error('Error loading payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate daily revenue for chart
  const dailyRevenueData = payments
    .filter((p) => p.status === 'succeeded')
    .reduce(
      (acc, payment) => {
        const date = new Date(payment.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          existing.revenue += payment.amount
          existing.count += 1
        } else {
          acc.push({ date, revenue: payment.amount, count: 1 })
        }
        return acc
      },
      [] as { date: string; revenue: number; count: number }[],
    )
    .slice(-14) // Last 14 days

  // Status breakdown for pie chart
  const statusBreakdown = payments.reduce(
    (acc, payment) => {
      const status = payment.status
      const existing = acc.find((item) => item.name === status)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: status, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Payment methods breakdown
  const paymentMethodsData = payments
    .filter((p) => p.payment_method_type)
    .reduce(
      (acc, payment) => {
        const method = payment.payment_method_type || 'unknown'
        const existing = acc.find((item) => item.method === method)
        if (existing) {
          existing.count += 1
          existing.amount += payment.amount
        } else {
          acc.push({ method, count: 1, amount: payment.amount })
        }
        return acc
      },
      [] as { method: string; count: number; amount: number }[],
    )

  const formatCurrency = (amount: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  const totalRevenue = revenueStats?.total_revenue || 0
  const totalRefunds = revenueStats?.total_refunds || 0
  const netRevenue = revenueStats?.net_revenue || 0
  const successfulPayments = revenueStats?.successful_payments || 0
  const failedPayments = revenueStats?.failed_payments || 0
  const conversionRate =
    successfulPayments + failedPayments > 0
      ? (successfulPayments / (successfulPayments + failedPayments)) * 100
      : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-ocean-surface/60 border-cyan-bright/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-soft">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-cyan-bright" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-cyan-soft/70 mt-1">
              {successfulPayments} successful payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-ocean-surface/60 border-cyan-bright/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-soft">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(netRevenue)}</div>
            <p className="text-xs text-cyan-soft/70 mt-1">
              After {formatCurrency(totalRefunds)} in refunds
            </p>
          </CardContent>
        </Card>

        <Card className="bg-ocean-surface/60 border-cyan-bright/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-soft">Conversion Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-cyan-bright" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-cyan-soft/70 mt-1">
              {successfulPayments} of {successfulPayments + failedPayments} attempts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-ocean-surface/60 border-cyan-bright/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-soft">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{failedPayments}</div>
            <p className="text-xs text-cyan-soft/70 mt-1">
              {((failedPayments / (successfulPayments + failedPayments)) * 100).toFixed(1)}% failure
              rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-ocean-deep/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Revenue Chart */}
            <Card className="bg-ocean-surface/60 border-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Daily Revenue (Last 14 Days)</CardTitle>
                <CardDescription>Track your daily earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Revenue',
                      color: 'hsl(var(--cyan-bright))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart data={dailyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                    <XAxis dataKey="date" stroke="#64b5f6" />
                    <YAxis stroke="#64b5f6" />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      fill="rgba(14, 165, 233, 0.2)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card className="bg-ocean-surface/60 border-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-cyan-bright">Payment Status</CardTitle>
                <CardDescription>Distribution of payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="bg-ocean-surface/60 border-cyan-bright/10">
            <CardHeader>
              <CardTitle className="text-cyan-bright">Payment Methods</CardTitle>
              <CardDescription>Breakdown by payment type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  amount: {
                    label: 'Amount',
                    color: 'hsl(var(--cyan-bright))',
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={paymentMethodsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="method" stroke="#64b5f6" />
                  <YAxis stroke="#64b5f6" />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" fill="#0ea5e9" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="bg-ocean-surface/60 border-cyan-bright/10">
            <CardHeader>
              <CardTitle className="text-cyan-bright">Recent Transactions</CardTitle>
              <CardDescription>Last 100 payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cyan-bright/20">
                      <TableHead className="text-cyan-soft">Date</TableHead>
                      <TableHead className="text-cyan-soft">Customer</TableHead>
                      <TableHead className="text-cyan-soft">Amount</TableHead>
                      <TableHead className="text-cyan-soft">Method</TableHead>
                      <TableHead className="text-cyan-soft">Status</TableHead>
                      <TableHead className="text-cyan-soft">ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice(0, 20).map((payment) => (
                      <TableRow key={payment.id} className="border-cyan-bright/10">
                        <TableCell className="text-cyan-soft">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {payment.customer_email || 'N/A'}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell className="text-cyan-soft">
                          {payment.card_brand ? (
                            <div className="flex items-center gap-2">
                              <span className="capitalize">{payment.card_brand}</span>
                              {payment.last_four && <span>••{payment.last_four}</span>}
                            </div>
                          ) : (
                            payment.payment_method_type || 'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={STATUS_COLORS[payment.status] || STATUS_COLORS.processing}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(payment.status)}
                              {payment.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cyan-soft font-mono text-xs">
                          {payment.stripe_payment_intent_id.slice(-8)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-ocean-surface/60 border-cyan-bright/10">
            <CardHeader>
              <CardTitle className="text-cyan-bright">Payment History</CardTitle>
              <CardDescription>Audit trail of all payment status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.length === 0 ? (
                  <p className="text-center text-cyan-soft/70 py-8">No history available yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyan-bright/20">
                          <TableHead className="text-cyan-soft">Date</TableHead>
                          <TableHead className="text-cyan-soft">Payment ID</TableHead>
                          <TableHead className="text-cyan-soft">Status Change</TableHead>
                          <TableHead className="text-cyan-soft">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((history) => (
                          <TableRow key={history.id} className="border-cyan-bright/10">
                            <TableCell className="text-cyan-soft">
                              {new Date(history.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-foreground font-mono text-xs">
                              {history.payment_id.slice(-8)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {history.old_status && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      STATUS_COLORS[history.old_status] || STATUS_COLORS.processing
                                    }
                                  >
                                    {history.old_status}
                                  </Badge>
                                )}
                                <ArrowUpRight className="h-4 w-4 text-cyan-soft" />
                                <Badge
                                  variant="outline"
                                  className={
                                    STATUS_COLORS[history.new_status] || STATUS_COLORS.processing
                                  }
                                >
                                  {history.new_status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-cyan-soft">
                              {history.change_reason || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-ocean-surface/60 border-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-soft">Average Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(successfulPayments > 0 ? totalRevenue / successfulPayments : 0)}
                </div>
                <p className="text-xs text-cyan-soft/70 mt-1">Per successful payment</p>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/60 border-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-soft">Refund Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {totalRevenue > 0 ? ((totalRefunds / totalRevenue) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-xs text-cyan-soft/70 mt-1">
                  {formatCurrency(totalRefunds)} refunded
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ocean-surface/60 border-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-soft">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{payments.length}</div>
                <p className="text-xs text-cyan-soft/70 mt-1">All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Trend Analysis */}
          <Card className="bg-ocean-surface/60 border-cyan-bright/10">
            <CardHeader>
              <CardTitle className="text-cyan-bright">Revenue Trend</CardTitle>
              <CardDescription>14-day moving average</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: 'Revenue',
                    color: 'hsl(var(--cyan-bright))',
                  },
                }}
                className="h-[300px]"
              >
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" stroke="#64b5f6" />
                  <YAxis stroke="#64b5f6" />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9' }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
