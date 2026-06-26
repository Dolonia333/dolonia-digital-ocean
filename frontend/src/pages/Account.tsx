import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import InvoiceCreator from '@/components/InvoiceCreator'
import InvoiceViewer from '@/components/InvoiceViewer'
import IntakeViewer from '@/components/IntakeViewer'
import RoomBookingDashboard from '@/components/RoomBookingDashboard'
import PaymentTrackingDashboard from '@/components/PaymentTrackingDashboard'
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'
import {
  Briefcase,
  Calendar,
  CalendarDays,
  CreditCard,
  LogOut,
  Target,
  TrendingUp,
  Users,
  Mail,
  Clipboard,
  AlertCircle,
  DollarSign,
  ClipboardCheck,
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Send,
  Archive,
  MessageSquare,
  HeadphonesIcon,
  BookOpen,
  PhoneCall,
  Activity,
  Database,
  Zap,
  Server,
  Bell,
  FileText,
  PlayCircle,
  ExternalLink,
  Settings,
  BarChart3,
  LifeBuoy,
  RefreshCw,
  Shield,
  UserCheck,
  Ticket,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { LucideIcon } from 'lucide-react'

// Notification types
type Notification = {
  id: string
  message: string
  recipients: string[]
  created_by: string | null
  created_at: string
}

type Profile = {
  id: string
  name: string
  role: 'admin' | 'team_member' | 'client' | 'user'
  is_archived?: boolean
  archived_at?: string
}

type Ticket = {
  id: string
  title: string
  description: string
  status: string
  priority: string | null
  category: string | null
  created_by: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  closed_at: string | null
}

type TicketResponse = {
  id: string
  ticket_id: string
  message: string
  created_by: string | null
  is_internal_note: boolean
  created_at: string
}

type Project = {
  id: string | number
  name: string
  status?: string
  description?: string
  created_at?: string
  monthly_fee?: number | string
  total_budget?: number | string
  notes?: string
}

type Subscription = {
  id: string | number
  plan?: string
  status?: string
  current_period_end?: string
  price?: number | string
  billing_cycle?: string
  created_at?: string
}

type Invoice = {
  id: string | number
  invoice_number?: string
  client_name?: string
  client_email?: string
  due_date?: string
  amount?: number | string
  status?: string
  total_amount?: number | string
  created_at?: string
}

type Client = {
  id: string | number
  company?: string
  contact_name?: string
  phone?: string
  status?: string
  name?: string
  created_at?: string
}

type Lead = {
  id: string | number
  name?: string
  email?: string
  message?: string
  status?: string
  created_at?: string
  source?: string
  assigned_to?: string
  archive_reason?: string
  archive_category?: string
}

type IntakeForm = {
  id: string
  full_name: string
  company_name?: string
  email: string
  phone?: string
  preferred_contact?: string
  division: string
  service_category: string
  service_focus?: string[]
  budget_range?: string
  custom_budget?: string
  timeline?: string
  referral_source?: string
  tech_details?: Record<string, unknown>
  media_details?: Record<string, unknown>
  business_details?: Record<string, unknown>
  recommended_tier?: string
  estimated_cost?: number
  priority_score?: number
  status: string
  assigned_to?: string
  notes?: string
  created_at: string
  updated_at?: string
  followed_up_at?: string
}

type NewsletterSubscriber = {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
  unsubscribed_at?: string
  source?: string
  ip_address?: string
  user_agent?: string
}

type ActivityItem = {
  id: string
  type: 'lead' | 'intake' | 'newsletter' | 'client' | 'invoice'
  title: string
  description: string
  timestamp: string
  icon: LucideIcon
}

type StatCardProps = {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
}

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
)

export default function Account() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationRecipients, setNotificationRecipients] = useState<string[]>([]) // profile ids
  const [notificationRecipientType, setNotificationRecipientType] = useState<
    'all_users' | 'all_clients' | 'individual'
  >('all_clients')
  const [sendingNotification, setSendingNotification] = useState(false)
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]) // All user profiles for recipient selection
  const [updatingRole, setUpdatingRole] = useState<string | null>(null) // Track which user's role is being updated
  const [userSearchTerm, setUserSearchTerm] = useState('') // Search filter for user management
  const debouncedUserSearchTerm = useDebounce(userSearchTerm, 300) // Debounce search to reduce renders

  // Archive lead state
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [leadToArchive, setLeadToArchive] = useState<Lead | null>(null)
  const [archiveReason, setArchiveReason] = useState('')
  const [archiveCategory, setArchiveCategory] = useState<
    'not-interested' | 'no-budget' | 'bad-fit' | 'spam' | 'duplicate' | 'other'
  >('not-interested')

  // Archive user state
  const [archiveUserDialogOpen, setArchiveUserDialogOpen] = useState(false)
  const [userToArchive, setUserToArchive] = useState<Profile | null>(null)
  const [archiveUserReason, setArchiveUserReason] = useState('')
  const [archivingUser, setArchivingUser] = useState<string | null>(null)

  // Intake form edit state
  const [intakeFormEditDialogOpen, setIntakeFormEditDialogOpen] = useState(false)
  const [intakeFormEditing, setIntakeFormEditing] = useState<IntakeForm | null>(null)
  const [intakeFormEditNotes, setIntakeFormEditNotes] = useState('')

  // Intake form filters and search
  const [formSearchQuery, setFormSearchQuery] = useState('')
  const [formStatusFilter, setFormStatusFilter] = useState('all')
  const [formDivisionFilter, setFormDivisionFilter] = useState('all')

  // Ticket state - only for viewing/managing existing tickets
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [ticketResponses, setTicketResponses] = useState<TicketResponse[]>([])
  const [responseMessage, setResponseMessage] = useState('')
  const [sendingResponse, setSendingResponse] = useState(false)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [intakeForms, setIntakeForms] = useState<IntakeForm[]>([])
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300) // Debounce search to reduce renders
  const [filterStatus, setFilterStatus] = useState('all')

  // Ref to track polling interval for real-time fallback
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [filterDivision, setFilterDivision] = useState('all')
  const [adminViewMode, setAdminViewMode] = useState<'admin' | 'client' | 'team' | 'user'>('admin')
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'dashboard'
    | 'leads'
    | 'clients'
    | 'invoices'
    | 'intake-forms'
    | 'newsletter'
    | 'notifications'
    | 'forms'
    | 'users'
    | 'support-tickets'
    | 'user-management'
    | 'send-notification'
    | 'ai-agent'
    | 'payments'
    | 'calendar'
    | 'analytics'
  >('dashboard')
  const navigate = useNavigate()

  // Helper function to check if user is staff (admin or team_member)
  const isStaff = (role: string | undefined) => role === 'admin' || role === 'team_member'
  const isAdmin = (role: string | undefined) => role === 'admin'

  useEffect(() => {
    // Load notifications for both admin and users
    async function loadNotifications() {
      if (isStaff(profile?.role)) {
        // Staff sees all notifications they created
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && data) setNotifications(data as Notification[])
      } else if (profile?.id) {
        // Users see notifications sent to them
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`recipients.cs.{${profile.id}},recipients.eq.{}`)
          .order('created_at', { ascending: false })
        if (!error && data) {
          console.log('User notifications:', data)
          setNotifications(data as Notification[])
        }
      }
    }
    loadNotifications()
  }, [profile?.role, profile?.id])

  // LAZY LOAD: Load clients only when Clients tab is active
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'clients') return
    if (clients.length > 0) return // Already loaded

    async function loadClients() {
      console.log('Loading clients data...')
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) // LIMIT to first 50 rows to prevent huge loads
      if (!error && data) {
        console.log(`Loaded ${data.length} clients`)
        setClients(data as Client[])
      }
    }
    loadClients()
  }, [profile?.role, activeAdminTab, clients.length])

  // LAZY LOAD: Load leads only when Leads tab is active
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'leads') return
    if (leads.length > 0) return // Already loaded

    async function loadLeads() {
      console.log('Loading leads data...')
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // LIMIT: Load only first 100 leads
      if (!error && data) {
        console.log(`Loaded ${data.length} leads`)
        setLeads(data as Lead[])
      }
    }
    loadLeads()
  }, [profile?.role, activeAdminTab, leads.length])

  // LAZY LOAD: Load intake forms only when Intake Forms tab is active
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'intake-forms') return
    if (intakeForms.length > 0) return // Already loaded

    async function loadIntakeForms() {
      console.log('Loading intake forms data...')
      const { data, error } = await supabase
        .from('intake_forms')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // LIMIT: Load only first 100 intake forms
      if (!error && data) {
        console.log(`Loaded ${data.length} intake forms`)
        setIntakeForms(data as unknown as IntakeForm[])
      }
    }
    loadIntakeForms()
  }, [profile?.role, activeAdminTab, intakeForms.length])

  // LAZY LOAD: Load newsletter subscribers only when Newsletter tab is active
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'newsletter') return
    if (newsletterSubscribers.length > 0) return // Already loaded

    async function loadNewsletterSubscribers() {
      console.log('Loading newsletter subscribers data...')
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })
        .limit(100) // LIMIT: Load only first 100 subscribers
      if (!error && data) {
        console.log(`Loaded ${data.length} newsletter subscribers`)
        setNewsletterSubscribers(data as unknown as NewsletterSubscriber[])
      }
    }
    loadNewsletterSubscribers()
  }, [profile?.role, activeAdminTab, newsletterSubscribers.length])

  // LAZY LOAD: Load invoices only when Invoices tab is active (for admin)
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'invoices') return
    if (invoices.length > 0) return // Already loaded

    async function loadInvoices() {
      console.log('Loading invoices data...')
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: false })
        .limit(100) // LIMIT: Load only first 100 invoices
      if (!error && data) {
        console.log(`Loaded ${data.length} invoices`)
        setInvoices(data as Invoice[])
      }
    }
    loadInvoices()
  }, [profile?.role, activeAdminTab, invoices.length])

  // LAZY LOAD: Load all profiles for user management (needed by admin for role updates)
  useEffect(() => {
    if (profile?.role !== 'admin' || activeAdminTab !== 'dashboard') return
    if (allProfiles.length > 0) return // Already loaded

    async function loadAllProfiles() {
      const { data, error } = await supabase.from('profiles').select('id, name, role')
      if (!error && data) {
        setAllProfiles(data as Profile[])
      }
    }
    loadAllProfiles()
  }, [profile?.role, activeAdminTab, allProfiles.length])

  // Admin: Send notification
  async function sendNotification() {
    if (!notificationMessage.trim()) {
      toast.error('Message cannot be empty')
      return
    }
    setSendingNotification(true)
    let recipients: string[] = []
    if (notificationRecipientType === 'all_users') {
      // Fetch all user profile ids
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id')
      if (!allProfilesError && allProfiles) {
        recipients = allProfiles.map((p: { id: string }) => p.id)
      }
    } else if (notificationRecipientType === 'all_clients') {
      // Fetch all client profile ids
      const { data: clientProfiles, error: clientProfilesError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('role', 'client')
      if (!clientProfilesError && clientProfiles) {
        recipients = clientProfiles.map((p: { id: string }) => p.id)
      }
    } else if (notificationRecipientType === 'individual') {
      recipients = notificationRecipients
    }
    const { error } = await supabase.from('notifications').insert({
      message: notificationMessage,
      recipients,
      created_by: profile?.id,
    })
    setSendingNotification(false)
    if (error) {
      toast.error('Failed to send notification')
    } else {
      toast.success('Notification sent')
      setNotificationMessage('')
      setNotificationRecipients([])
      // Reload notifications
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
      setNotifications(data as Notification[])
    }
  }

  // Load tickets based on user role
  const loadTickets = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('tickets').select('*').order('created_at', { ascending: false })

      // If not admin, only show own tickets
      const isAdmin = profile?.role === 'admin'
      if (!isAdmin) {
        query = query.eq('created_by', user.id)
      }

      const { data, error } = await query
      if (error) throw error

      setTickets(data as Ticket[])
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast.error('Failed to load tickets: ' + (error as Error).message)
    }
  }, [profile])

  // Load responses for a specific ticket
  const loadTicketResponses = useCallback(async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setTicketResponses(data as TicketResponse[])
    } catch (error) {
      console.error('Error loading ticket responses:', error)
      toast.error('Failed to load responses: ' + (error as Error).message)
    }
  }, [])

  // Respond to a ticket
  async function respondToTicket() {
    if (!selectedTicket || !responseMessage.trim()) {
      toast.error('Please enter a response message')
      return
    }

    setSendingResponse(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in')
        return
      }

      const { error } = await supabase.from('ticket_responses').insert({
        ticket_id: selectedTicket.id,
        message: responseMessage,
        created_by: user.id,
        is_internal_note: false,
      })

      if (error) throw error

      toast.success('Response sent successfully')
      setResponseMessage('')
      await loadTicketResponses(selectedTicket.id)
    } catch (error) {
      console.error('Error sending response:', error)
      toast.error('Failed to send response: ' + (error as Error).message)
    } finally {
      setSendingResponse(false)
    }
  }

  // Update ticket status (admin only)
  async function updateTicketStatus(ticketId: string, newStatus: string) {
    if (profile && profile.role !== 'admin') {
      toast.error('Only admins can update ticket status')
      return
    }

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId)

      if (error) throw error

      toast.success('Ticket status updated')
      await loadTickets()

      // Update selected ticket if it's the one being modified
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
      toast.error('Failed to update status: ' + (error as Error).message)
    }
  }

  // Update user role (admin only)
  async function updateUserRole(
    userId: string,
    newRole: 'admin' | 'team_member' | 'client' | 'user',
  ) {
    if (profile?.role !== 'admin') {
      toast.error('Only admins can update user roles')
      return
    }

    // Prevent admins from changing their own role
    if (userId === profile.id) {
      toast.error('You cannot change your own role')
      return
    }

    setUpdatingRole(userId)

    // Optimistic update: Update UI immediately
    const previousProfiles = [...allProfiles]
    setAllProfiles((prevProfiles) =>
      prevProfiles.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    )

    try {
      console.log(`Updating user ${userId} to role: ${newRole}`)

      const { data: updateData, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select('id, name, role')

      if (error) {
        console.error('Update error:', error)
        // Revert on error
        setAllProfiles(previousProfiles)
        throw error
      }

      console.log('Update successful:', updateData)

      toast.success(`User role updated to ${newRole === 'team_member' ? 'Team Member' : newRole}`)
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update role: ' + (error as Error).message)
    } finally {
      setUpdatingRole(null)
    }
  }

  // Archive user - HARD DELETE (admin only)
  async function confirmArchiveUser() {
    if (!userToArchive) {
      toast.error('No user selected')
      return
    }

    if (profile?.role !== 'admin') {
      toast.error('Only admins can delete user accounts')
      return
    }

    if (userToArchive.id === profile.id) {
      toast.error('You cannot delete your own account')
      return
    }

    setArchivingUser(userToArchive.id)
    const userIdToDelete = userToArchive.id
    const userName = userToArchive.name

    try {
      // Delete all user's data in this order (respecting foreign key constraints):

      // 1. Delete invoice line items
      const invoiceIds =
        (
          await supabase
            .from('invoices')
            .select('id')
            .or(`user_id.eq.${userIdToDelete},client_email.eq.${userIdToDelete}`)
        ).data?.map((inv: { id: string }) => inv.id) || []

      if (invoiceIds.length > 0) {
        const lineItemsResult = await supabase
          .from('invoice_line_items')
          .delete()
          .in('invoice_id', invoiceIds)
        console.log('Deleted line items:', lineItemsResult)
      }

      // 2. Delete invoices
      try {
        const invoicesResult = await supabase
          .from('invoices')
          .delete()
          .or(`user_id.eq.${userIdToDelete},client_email.eq.${userIdToDelete}`)
        console.log('Deleted invoices:', invoicesResult)
      } catch (e) {
        console.warn('Error deleting invoices:', e)
      }

      // 3. Delete subscriptions
      try {
        const subsResult = await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', userIdToDelete)
        console.log('Deleted subscriptions:', subsResult)
      } catch (e) {
        console.warn('Error deleting subscriptions:', e)
      }

      // 4. Delete notifications for this user
      try {
        const notifResult = await supabase
          .from('notifications')
          .delete()
          .contains('recipients', [userIdToDelete])
        console.log('Deleted notifications:', notifResult)
      } catch (e) {
        console.warn('Error deleting notifications:', e)
      }

      // 5. Delete user profile - THIS IS THE CRITICAL DELETE
      console.log('About to delete profile for user:', userIdToDelete)
      const { data: deleteResult, error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userIdToDelete)
        .select()

      console.log('Profile deletion result:', deleteResult, profileError)
      if (profileError) {
        console.error('Profile deletion error:', profileError)
        throw profileError
      }

      // Immediately remove from local state
      const updatedProfiles = allProfiles.filter((u) => u.id !== userIdToDelete)
      console.log('Updated profiles after deletion:', updatedProfiles.length)
      setAllProfiles(updatedProfiles)

      // Toast messages
      toast.success(
        `User account "${userName}" and all associated data have been permanently deleted`,
      )
      setArchiveUserDialogOpen(false)
      setUserToArchive(null)
      setArchiveUserReason('')
    } catch (error) {
      console.error('Error deleting user account:', error)
      toast.error('Failed to delete user account: ' + (error as Error).message)
      // Reload profiles to refresh the UI in case of partial deletion
      try {
        const { data } = await supabase.from('profiles').select('*')
        if (data) setAllProfiles(data as Profile[])
      } catch (e) {
        console.error('Error reloading profiles:', e)
      }
    } finally {
      setArchivingUser(null)
    }
  }

  // Restore archived user (admin only)
  async function restoreArchivedUser(user: Profile) {
    // This function is no longer needed since we're doing hard deletes
    // Keeping it for reference but it won't be called
    console.log('Restore function no longer supported - users are permanently deleted')
    return
  }

  // Lead management functions
  async function sendEmailToLead(lead: Lead) {
    if (!lead.email) {
      toast.error('No email address for this lead')
      return
    }
    // Open email client with pre-filled email
    const subject = encodeURIComponent('Re: Your inquiry')
    const body = encodeURIComponent(`Hi ${lead.name},\n\nThank you for reaching out!\n\n`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')

    // Update lead status to contacted
    const { error } = await supabase
      .from('leads')
      .update({ status: 'contacted' })
      .eq('id', lead.id as number)

    if (!error) {
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === lead.id ? { ...l, status: 'contacted' } : l)),
      )
      toast.success('Email client opened. Lead marked as contacted.')
    }
  }

  async function convertLeadToClient(lead: Lead) {
    if (!lead.email || !lead.name) {
      toast.error('Lead must have email and name to convert to client')
      return
    }

    try {
      // Create a new client from the lead
      const { error: clientError } = await supabase.from('clients').insert({
        name: lead.name,
        email: lead.email,
        company: lead.name, // Use name as company if not provided
        message: lead.message || '',
        phone: '', // Required field, set to empty string
      })

      if (clientError) throw clientError

      // Update lead status to converted
      const { error: leadError } = await supabase
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', lead.id as number)

      if (leadError) throw leadError

      // Refresh data
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      setClients((clientsData as Client[]) || [])
      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === lead.id ? { ...l, status: 'converted' } : l)),
      )

      toast.success(`${lead.name} converted to client!`)
    } catch (error) {
      console.error('Error converting lead:', error)
      toast.error('Failed to convert lead: ' + (error as Error).message)
    }
  }

  async function archiveLead(lead: Lead) {
    // Open dialog to get archive reason
    setLeadToArchive(lead)
    setArchiveDialogOpen(true)
  }

  async function confirmArchiveLead() {
    if (!leadToArchive) return

    try {
      const { error } = await (supabase as any)
        .from('leads')
        .update({
          status: 'archived',
          archive_reason: archiveReason,
          archive_category: archiveCategory,
        })
        .eq('id', leadToArchive.id as number)

      if (error) throw error

      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l.id === leadToArchive.id
            ? {
                ...l,
                status: 'archived',
                archive_reason: archiveReason,
                archive_category: archiveCategory,
              }
            : l,
        ),
      )

      toast.success('Lead archived')
      setArchiveDialogOpen(false)
      setLeadToArchive(null)
      setArchiveReason('')
      setArchiveCategory('not-interested')
    } catch (error) {
      console.error('Error archiving lead:', error)
      toast.error('Failed to archive lead: ' + (error as Error).message)
    }
  }

  async function unarchiveLead(lead: Lead) {
    try {
      const { error } = await (supabase as any)
        .from('leads')
        .update({
          status: 'new',
          archive_reason: null,
          archive_category: null,
        })
        .eq('id', lead.id as number)

      if (error) throw error

      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l.id === lead.id
            ? {
                ...l,
                status: 'new',
                archive_reason: undefined,
                archive_category: undefined,
              }
            : l,
        ),
      )

      toast.success('Lead unarchived')
    } catch (error) {
      console.error('Error unarchiving lead:', error)
      toast.error('Failed to unarchive lead: ' + (error as Error).message)
    }
  }

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        toast.error('Failed to get session')
        return
      }

      if (!session) {
        console.log('No session found, redirecting to login')
        // Clear any stale cache when no session
        localStorage.removeItem('userProfile')
        navigate('/login')
        return
      }

      console.log('Session user ID:', session.user.id)

      // CACHE VERSION CHECK - Force refresh if app version changed
      const CACHE_VERSION = '1.0.1' // Increment this to bust all caches
      const cachedVersion = localStorage.getItem('cacheVersion')
      if (cachedVersion !== CACHE_VERSION) {
        console.log('Cache version mismatch - clearing all cache')
        localStorage.removeItem('userProfile')
        localStorage.setItem('cacheVersion', CACHE_VERSION)
      }

      // OPTIMIZATION: Check localStorage cache, but ONLY if it matches current session user
      const cachedProfile = localStorage.getItem('userProfile')
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile)
          // Validate cache matches current session user
          if (parsedProfile.id === session.user.id) {
            setProfile(parsedProfile)
            setLoading(false)
            console.log('Loaded profile from cache:', parsedProfile)
            return // Skip database query entirely!
          } else {
            console.log('Cache mismatch - clearing stale cache')
            localStorage.removeItem('userProfile') // Clear cache from different user
          }
        } catch (e) {
          console.error('Cache parse error:', e)
          localStorage.removeItem('userProfile') // Clear bad cache
        }
      }

      const { data: profileRecord, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('id', session.user.id)
        .single()

      let finalProfileRecord = profileRecord

      // If profile doesn't exist, create it automatically
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile...')
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            name: session.user.email,
            role: 'client', // Default new users to 'client' role
          })
          .select('id, name, role')
          .single()

        if (createError) {
          console.error('Failed to create profile:', createError)
          toast.error('Failed to create user profile')
          setLoading(false)
          return
        }

        finalProfileRecord = newProfile
        console.log('Profile created successfully:', finalProfileRecord)
      } else if (error) {
        console.error('Profile fetch error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        toast.error('Failed to load profile')
        setLoading(false)
        return
      }

      let profileData = finalProfileRecord as Profile

      // If role is not set, default to 'client' and update the database, then reload to ensure UI updates
      if (!profileData.role) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'client' })
          .eq('id', profileData.id)
          .select('id, name, role')
          .single()

        if (updateError) {
          console.warn('Failed to set default role, using client-side default.', updateError)
          profileData = { ...profileData, role: 'client' }
        } else if (updatedProfile) {
          // Force reload so the UI picks up the new role
          window.location.reload()
          return
        }
      }

      // Auto-promote specific email addresses to admin (whitelist approach)
      const adminEmails = [
        'zionvanzandt@gmail.com',
        'zion@Dolonia.cloud',
        // Add other admin emails here
      ]

      const userEmail = (session.user.email ?? '').toLowerCase()
      const shouldPromoteToAdmin = adminEmails.includes(userEmail)

      if (profileData && shouldPromoteToAdmin && profileData.role !== 'admin') {
        const { data: promotedProfile, error: promoteError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profileData.id)
          .select('id, name, role')
          .single()

        if (promoteError) {
          console.warn(
            'Failed to promote profile automatically, applying client-side override.',
            promoteError,
          )
          profileData = { ...profileData, role: 'admin' }
        } else if (promotedProfile) {
          profileData = promotedProfile as Profile
        }
      }

      setProfile(profileData)
      // OPTIMIZATION: Cache profile in localStorage for instant loads on subsequent visits
      localStorage.setItem('userProfile', JSON.stringify(profileData))

      if (profileData?.role === 'client') {
        const [projectsRes, subsRes, invoicesRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('subscriptions').select('*').eq('user_id', profileData.id),
          supabase
            .from('invoices')
            .select('*')
            .eq('user_id', profileData.id)
            .order('due_date', { ascending: false }),
        ])

        setProjects((projectsRes.data as Project[]) || [])
        setSubscriptions((subsRes.data as Subscription[]) || [])
        setInvoices((invoicesRes.data as Invoice[]) || [])
        setClients([])
        setLeads([])
      } else if (profileData?.role === 'admin') {
        // LAZY LOAD: Don't load all admin data on mount. Data will be loaded per-tab when tabs are clicked.
        // This prevents 3.7GB memory usage by not loading all tables simultaneously.
        console.log('Admin detected - data will load per-tab')
      }

      // Load notifications for all users (OPTIMIZATION: limit to 50 most recent)
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) // OPTIMIZATION: Only load last 50 notifications (saves 100-200ms)

      if (notificationsData) {
        const userNotifications = notificationsData.filter(
          (n: Notification) =>
            n.recipients.includes('all_users') ||
            n.recipients.includes('all_clients') ||
            n.recipients.includes(profileData?.id || ''),
        )
        setNotifications(userNotifications)
      }

      // Load tickets
      await loadTickets()

      setLoading(false)
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]) // Removed loadTickets to prevent infinite re-renders

  // Refresh profiles when role resolves (admin only)
  useEffect(() => {
    async function refreshAdminProfiles() {
      if (profile?.role !== 'admin') return
      const { data, error } = await supabase.from('profiles').select('id, name, role')
      if (!error && data) {
        setAllProfiles(data as Profile[])
      }
    }
    refreshAdminProfiles()
  }, [profile?.role])

  // Subscribe to realtime profile changes for current user
  useEffect(() => {
    if (!profile?.id) return

    console.log('[Real-time] Setting up subscription for user:', profile.id)

    let channel: ReturnType<typeof supabase.channel> | null = null

    try {
      channel = supabase
        .channel('user-profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profile.id}`, // Only listen to changes for THIS user
          },
          (payload) => {
            const updatedProfile = payload.new as Profile
            console.log('[Real-time] Profile updated:', updatedProfile)

            // Update the profile state
            setProfile(updatedProfile)

            // Update localStorage cache
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

            // Show notification to user
            toast.info(
              `Your role has been updated to ${updatedProfile.role === 'team_member' ? 'Team Member' : updatedProfile.role}`,
            )

            // If role changed, reload the page to ensure proper UI/permissions
            if (updatedProfile.role !== profile.role) {
              console.log('[Real-time] Role changed, reloading in 1.5s...')
              setTimeout(() => {
                window.location.reload()
              }, 1500) // Give time for toast to show
            }
          },
        )
        .subscribe((status) => {
          console.log('[Real-time] Subscription status:', status)
          // Check for error states - status can be SUBSCRIBED, CHANNEL_ERROR, TIMED_OUT, or CLOSED
          if (status !== 'SUBSCRIBED') {
            console.warn('[Real-time] Subscription not active, status:', status)
            // Only start polling if we haven't already (prevent duplicates)
            if (!pollIntervalRef.current) {
              console.log('[Real-time] Starting fallback polling (5s intervals)')
              // Fallback: poll for changes every 5 seconds
              pollIntervalRef.current = setInterval(async () => {
                const { data } = await supabase
                  .from('profiles')
                  .select('id, name, role')
                  .eq('id', profile.id)
                  .single()

                if (data && data.role !== profile.role) {
                  console.log('[Polling] Role changed detected:', data.role)
                  setProfile(data as Profile)
                  localStorage.setItem('userProfile', JSON.stringify(data))
                  toast.info(`Your role has been updated to ${data.role}`)
                  setTimeout(() => window.location.reload(), 1500)
                }
              }, 5000)
            }
          } else {
            // If we're successfully subscribed, clear any polling interval
            if (pollIntervalRef.current) {
              console.log('[Real-time] Subscription active, clearing fallback polling')
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }
          }
        })
    } catch (err) {
      console.warn('[Real-time] Failed to set up WebSocket subscription, falling back to polling:', err)
      // Start fallback polling since realtime is unavailable
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(async () => {
          const { data } = await supabase
            .from('profiles')
            .select('id, name, role')
            .eq('id', profile.id)
            .single()

          if (data && data.role !== profile.role) {
            console.log('[Polling] Role changed detected:', data.role)
            setProfile(data as Profile)
            localStorage.setItem('userProfile', JSON.stringify(data))
            toast.info(`Your role has been updated to ${data.role}`)
            setTimeout(() => window.location.reload(), 1500)
          }
        }, 5000)
      }
    }

    return () => {
      console.log('[Real-time] Unsubscribing from user profile changes')
      if (channel) {
        try {
          void channel.unsubscribe()
        } catch {
          // Ignore unsubscribe errors
        }
      }
      // Clean up polling interval if it exists
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [profile?.id, profile?.role])

  // Subscribe to realtime profile changes (admin only - for user management table)
  useEffect(() => {
    if (profile?.role !== 'admin') return

    console.log('[Real-time Admin] Setting up profiles subscription')

    let channel: ReturnType<typeof supabase.channel> | null = null

    try {
      channel = supabase
        .channel('profiles-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          console.log('[Real-time Admin] Profile change:', payload.eventType, payload.new)
          setAllProfiles((prev) => {
            if (payload.eventType === 'INSERT') {
              const newProfile = payload.new as Profile
              // Avoid duplicates
              if (prev.some((p) => p.id === newProfile.id)) return prev
              return [...prev, newProfile]
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((p) =>
                p.id === (payload.new as Profile).id ? (payload.new as Profile) : p,
              )
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((p) => p.id !== (payload.old as { id: string }).id)
            }
            return prev
          })
        })
        .subscribe((status) => {
          console.log('[Real-time Admin] Subscription status:', status)
        })
    } catch (err) {
      console.warn('[Real-time Admin] Failed to set up WebSocket subscription:', err)
    }

    return () => {
      console.log('[Real-time Admin] Unsubscribing from profiles changes')
      if (channel) {
        try {
          void channel.unsubscribe()
        } catch {
          // Ignore unsubscribe errors
        }
      }
    }
  }, [profile?.role])

  // Manual refresh function for users to check for role updates
  async function checkForUpdates() {
    if (!profile?.id) return

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('id', profile.id)
      .single()

    if (error) {
      toast.error('Failed to check for updates')
      return
    }

    if (data && data.role !== profile.role) {
      console.log('[Manual Check] Role changed:', data.role)
      setProfile(data as Profile)
      localStorage.setItem('userProfile', JSON.stringify(data))
      toast.success(`Your role has been updated to ${data.role}!`)
      setTimeout(() => window.location.reload(), 1500)
    } else {
      toast.success('You have the latest updates')
    }
  }

  async function signOut() {
    // Clear cached profile data before signing out
    localStorage.removeItem('userProfile')

    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const normalizeAmount = (amount: unknown) => {
    if (typeof amount === 'number') return amount
    if (typeof amount === 'string') {
      const parsed = Number(amount)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return 0
  }

  const clientStats = useMemo(() => {
    if (!profile || profile.role !== 'client') return []

    const activeProjects = projects.filter((project) => {
      const status = (project?.status || '').toString().toLowerCase()
      return ['active', 'in-progress', 'ongoing'].includes(status)
    }).length

    const activeSubscriptions = subscriptions.filter((sub) => {
      const status = (sub?.status || '').toString().toLowerCase()
      return ['active', 'trialing', 'past_due'].includes(status)
    }).length

    const totalBilled = invoices.reduce((sum, invoice) => sum + normalizeAmount(invoice?.amount), 0)
    const outstandingTotal = invoices
      .filter((invoice) => (invoice?.status || '').toString().toLowerCase() !== 'paid')
      .reduce((sum, invoice) => sum + normalizeAmount(invoice?.amount), 0)

    const nextInvoice = invoices
      .map((invoice) => ({
        date: invoice?.due_date ? new Date(invoice.due_date) : null,
        status: (invoice?.status || '').toString().toLowerCase(),
      }))
      .filter((invoice) => invoice.date && invoice.status !== 'paid')
      .sort((a, b) => (a.date && b.date ? a.date.getTime() - b.date.getTime() : 0))[0]?.date

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
        hint: outstandingTotal
          ? `$${outstandingTotal.toLocaleString()} outstanding`
          : 'All invoices paid',
        icon: TrendingUp,
      },
      {
        title: 'Next Billing Date',
        value: nextInvoice ? nextInvoice.toLocaleDateString() : 'Not scheduled',
        hint: 'Keep an eye on upcoming invoices',
        icon: CalendarDays,
      },
    ]
  }, [profile, projects, subscriptions, invoices])

  const adminActiveClients = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0

    return clients.filter((client) => {
      const status = (client?.status || '').toString().toLowerCase()
      return !status || ['active', 'engaged', 'priority'].includes(status)
    }).length
  }, [profile, clients])

  const adminLeadConversionRate = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return 0

    const activeCount = adminActiveClients
    return Math.round((Math.min(activeCount, clients.length) / leads.length) * 100)
  }, [profile, adminActiveClients, clients, leads])

  const adminStats = useMemo(() => {
    if (!profile || profile.role !== 'admin') return []

    const activeSubscriptions = subscriptions.filter((subscription) => {
      const status = (subscription?.status || '').toString().toLowerCase()
      return ['active', 'trialing', 'past_due'].includes(status)
    })

    const totalMRR = activeSubscriptions.reduce(
      (sum, subscription) => sum + normalizeAmount(subscription.price),
      0,
    )

    const inFlightProjects = projects.filter((project) => {
      const status = (project?.status || '').toString().toLowerCase()
      return ['active', 'in-progress', 'ongoing'].includes(status)
    }).length

    const pipelineValue = projects.reduce((sum, project) => {
      const total = normalizeAmount(project.total_budget)
      const monthly = normalizeAmount(project.monthly_fee)
      return sum + (total > 0 ? total : monthly)
    }, 0)

    const outstandingInvoicesList = invoices.filter((invoice) => {
      const status = (invoice?.status || '').toString().toLowerCase()
      return status && status !== 'paid' && status !== 'cancelled'
    })

    const outstandingInvoiceAmount = outstandingInvoicesList.reduce(
      (sum, invoice) => sum + normalizeAmount(invoice.total_amount ?? invoice.amount),
      0,
    )

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
    ]
  }, [
    profile,
    clients,
    subscriptions,
    projects,
    invoices,
    adminActiveClients,
    adminLeadConversionRate,
  ])

  // New calculations for intake forms
  const pendingIntakeForms = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0
    return intakeForms.filter((form) => form.status === 'new' || form.status === 'reviewing').length
  }, [profile, intakeForms])

  const activeNewsletterSubscribers = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0
    return newsletterSubscribers.filter((sub) => sub.is_active).length
  }, [profile, newsletterSubscribers])

  const leadsNeedingResponse = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    return leads.filter((lead) => {
      const createdAt = lead.created_at ? new Date(lead.created_at) : null
      const status = (lead?.status || '').toString().toLowerCase()
      return createdAt && createdAt < twentyFourHoursAgo && (status === 'new' || status === '')
    }).length
  }, [profile, leads])

  const todaysLeads = useMemo(() => {
    if (!profile || profile.role !== 'admin') return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return leads.filter((lead) => {
      const createdAt = lead.created_at ? new Date(lead.created_at) : null
      return createdAt && createdAt >= today
    }).length
  }, [profile, leads])

  // CSV Export functions
  const exportToCSV = (data: unknown[], filename: string) => {
    if (!data.length) {
      toast.error('No data to export')
      return
    }

    const headers = Object.keys(data[0] as Record<string, unknown>)
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = (row as Record<string, unknown>)[header]
            const stringValue = value?.toString() || ''
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue
          })
          .join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success(`Exported ${data.length} records`)
  }

  const invoiceChartData = useMemo(() => {
    if (!profile || profile.role !== 'client' || !invoices.length) return []

    const sorted = [...invoices]
      .filter((invoice) => invoice?.due_date)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(-6)

    return sorted.map((invoice) => ({
      label: new Date(invoice.due_date).toLocaleDateString(undefined, { month: 'short' }),
      revenue: normalizeAmount(invoice.amount),
    }))
  }, [profile, invoices])

  const leadStatusBreakdown = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return []

    const counts = new Map<string, number>()
    leads.forEach((lead) => {
      const status = (lead?.status || 'new').toString().trim().toLowerCase()
      counts.set(status, (counts.get(status) ?? 0) + 1)
    })

    const total = leads.length

    return Array.from(counts.entries())
      .map(([status, count]) => {
        const label = status
          .split(/[_\s]+/)
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(' ')
        const percent = total ? Math.round((count / total) * 100) : 0
        return { status: label || 'New', count, percent }
      })
      .sort((a, b) => b.count - a.count)
  }, [profile, leads])

  const adminLeadChartData = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !leads.length) return []

    const buckets = new Map<string, { label: string; order: number; value: number }>()

    leads.forEach((lead) => {
      if (!lead?.created_at) return
      const createdAt = new Date(lead.created_at)
      if (!Number.isFinite(createdAt.getTime())) return

      const bucketKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`
      const monthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1)
      const label = createdAt.toLocaleDateString(undefined, { month: 'short' })

      const current = buckets.get(bucketKey)
      if (current) {
        current.value += 1
      } else {
        buckets.set(bucketKey, { label, order: monthStart.getTime(), value: 1 })
      }
    })

    return Array.from(buckets.values())
      .sort((a, b) => a.order - b.order)
      .slice(-6)
      .map(({ label, value }) => ({ label, leads: value }))
  }, [profile, leads])

  const outstandingAdminInvoices = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !invoices.length) return []

    return invoices
      .filter((invoice) => {
        const status = (invoice?.status || '').toString().toLowerCase()
        return status && status !== 'paid' && status !== 'cancelled'
      })
      .sort((a, b) => {
        const aDue = a?.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER
        const bDue = b?.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER
        return aDue - bDue
      })
      .slice(0, 6)
  }, [profile, invoices])

  const recentClients = useMemo(() => {
    if (!profile || profile.role !== 'admin' || !clients.length) return []

    return [...clients]
      .sort((a, b) => {
        const aCreated = a?.created_at ? new Date(a.created_at).getTime() : 0
        const bCreated = b?.created_at ? new Date(b.created_at).getTime() : 0
        return bCreated - aCreated
      })
      .slice(0, 6)
  }, [profile, clients])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading account..." />
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <Layout>
      <SEO
        title="Account | DOLONIA DATA TECH"
        description="Manage your DOLONIA DATA TECH account"
      />
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-8 md:py-16 space-y-4 sm:space-y-6 md:space-y-8 overflow-x-hidden min-w-0">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-cyan-bright/20 bg-gradient-to-r from-ocean-deep/90 via-ocean-surface/30 to-ocean-deep/90 p-3 sm:p-5 md:p-6 shadow-2xl shadow-cyan-bright/10 max-w-full w-full min-w-0">
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-cyan-bright/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-16 h-72 w-72 rounded-full bg-ocean-surface/40 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-2 xs:gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between max-w-full min-w-0">
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-bright/30 bg-ocean-deep/70 px-2 xs:px-2.5 sm:px-3 py-1 text-[10px] xs:text-xs text-cyan-soft shadow-inner">
                <span className="rounded-full bg-cyan-bright/20 p-0.5 xs:p-1">
                  <Users className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-cyan-bright" />
                </span>
                <span className="truncate">Welcome back, {profile.name || 'Explorer'}!</span>
              </div>
              <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                Account Command Center
              </h1>
              <p className="max-w-xl text-[11px] xs:text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Monitor your cloud presence, track subscriptions, and stay ahead of what’s next for
                your Dolonia experience.
              </p>
            </div>
            <div className="flex flex-col items-stretch sm:items-start gap-2 md:items-end w-full sm:w-auto min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-bright/20 px-3 py-1 text-xs font-medium text-cyan-bright justify-center sm:justify-start">
                <span className="font-semibold capitalize">
                  {profile?.role === 'team_member' ? 'Team Member' : profile?.role}
                </span>
                <Badge
                  variant={isStaff(profile?.role) ? 'default' : 'secondary'}
                  className={`capitalize ${
                    profile?.role === 'team_member'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                      : ''
                  }`}
                >
                  {profile?.role === 'team_member' ? 'Team Member' : profile?.role}
                </Badge>
              </div>
              {/* Admin View Mode Switcher - 4 Options */}
              {profile && profile.role === 'admin' && (
                <div className="flex gap-0.5 sm:gap-1 rounded-full border border-cyan-bright/30 bg-ocean-deep/70 p-0.5 sm:p-1 w-full max-w-full sm:max-w-none sm:w-auto overflow-x-auto">
                  <Button
                    onClick={() => setAdminViewMode('admin')}
                    size="sm"
                    variant={adminViewMode === 'admin' ? 'default' : 'ghost'}
                    className={`flex-1 sm:flex-initial text-[10px] sm:text-xs px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap ${adminViewMode === 'admin' ? 'bg-cyan-bright text-ocean-deep' : 'text-cyan-soft hover:text-cyan-bright'}`}
                  >
                    <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="text-[9px] sm:text-[10px]">Admin</span>
                  </Button>
                  <Button
                    onClick={() => setAdminViewMode('client')}
                    size="sm"
                    variant={adminViewMode === 'client' ? 'default' : 'ghost'}
                    className={`flex-1 sm:flex-initial text-[10px] sm:text-xs px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap ${adminViewMode === 'client' ? 'bg-cyan-bright text-ocean-deep' : 'text-cyan-soft hover:text-cyan-bright'}`}
                  >
                    <Briefcase className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="text-[9px] sm:text-[10px]">Client</span>
                  </Button>
                  <Button
                    onClick={() => setAdminViewMode('user')}
                    size="sm"
                    variant={adminViewMode === 'user' ? 'default' : 'ghost'}
                    className={`flex-1 sm:flex-initial text-[10px] sm:text-xs px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap ${adminViewMode === 'user' ? 'bg-cyan-bright text-ocean-deep' : 'text-cyan-soft hover:text-cyan-bright'}`}
                  >
                    <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="text-[9px] sm:text-[10px]">User</span>
                  </Button>
                  <Button
                    onClick={() => setAdminViewMode('team')}
                    size="sm"
                    variant={adminViewMode === 'team' ? 'default' : 'ghost'}
                    className={`flex-1 sm:flex-initial text-[10px] sm:text-xs px-1.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap ${adminViewMode === 'team' ? 'bg-cyan-bright text-ocean-deep' : 'text-cyan-soft hover:text-cyan-bright'}`}
                  >
                    <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    <span className="text-[9px] sm:text-[10px]">Team</span>
                  </Button>
                </div>
              )}
              {/* Manual Update Button & Sign Out */}
              <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                <Button
                  onClick={checkForUpdates}
                  variant="outline"
                  className="border-cyan-bright/40 text-cyan-bright text-xs w-full sm:w-auto hover:bg-cyan-bright/10 transition-colors"
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  <span className="hidden xs:inline">Check for Updates</span>
                  <span className="xs:hidden">Update</span>
                </Button>

                <Button
                  onClick={signOut}
                  variant="outline"
                  className="border-red-400/40 text-red-400 text-xs w-full sm:w-auto hover:bg-red-400/10 transition-colors"
                >
                  <LogOut className="mr-2 h-3 w-3" />
                  <span className="hidden xs:inline">Sign Out</span>
                  <span className="xs:hidden">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 xs:gap-3.5 sm:gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
          {(profile &&
          ((profile.role === 'admin' && adminViewMode === 'client') || profile.role === 'client')
            ? clientStats
            : adminStats
          ).map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full">
          <CardHeader className="flex flex-col gap-3 xs:gap-3.5 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-cyan-bright text-base xs:text-lg sm:text-xl">
                Profile Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs xs:text-sm">
                Quick snapshot of your Dolonia identity and role-specific access.
              </CardDescription>
            </div>
            <Badge
              variant={profile?.role === 'admin' ? 'default' : 'secondary'}
              className="capitalize text-xs xs:text-sm shrink-0"
            >
              {profile?.role}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 xs:gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <p className="text-xs xs:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Account Holder
              </p>
              <p className="mt-1 text-lg xs:text-xl sm:text-2xl font-semibold text-foreground truncate">
                {profile.name || 'Not set'}
              </p>
            </div>
            <div className="rounded-xl xs:rounded-2xl border border-cyan-bright/10 bg-ocean-deep/60 p-3 xs:p-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                Role Scope
              </p>
              <p className="mt-1 text-lg text-muted-foreground">
                {profile && profile.role === 'admin'
                  ? 'Full system access to manage clients, monitor leads, and streamline operations.'
                  : 'Track project momentum, billing timelines, and manage your Dolonia engagement.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Notification Controls - Only in Admin Mode */}
        {profile && profile.role === 'admin' && adminViewMode === 'admin' && (
          <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-cyan-bright flex items-center gap-2 text-sm sm:text-base md:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Send Notification / Alert
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs md:text-sm">
                Send a message to all users, all clients, or select individuals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <textarea
                id="notificationMessage"
                name="notificationMessage"
                className="w-full rounded border border-cyan-bright/20 bg-ocean-deep/70 p-2 sm:p-3 text-xs sm:text-sm md:text-base text-foreground min-h-[80px] sm:min-h-[100px]"
                rows={3}
                placeholder="Type your notification message..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                disabled={sendingNotification}
                aria-label="Notification message content"
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="recipientType"
                  className="text-xs md:text-sm font-semibold text-muted-foreground"
                >
                  Recipient Type
                </label>
                <select
                  id="recipientType"
                  name="recipientType"
                  className="w-full rounded border border-cyan-bright/20 bg-ocean-deep/70 p-2 sm:p-3 text-xs sm:text-sm md:text-base text-foreground"
                  value={notificationRecipientType}
                  onChange={(e) =>
                    setNotificationRecipientType(
                      e.target.value as 'all_users' | 'all_clients' | 'individual',
                    )
                  }
                  disabled={sendingNotification}
                >
                  <option value="all_users">All Users</option>
                  <option value="all_clients">All Clients</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              {notificationRecipientType === 'individual' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs md:text-sm font-semibold text-muted-foreground">
                    Select Recipients
                  </label>
                  <select
                    className="w-full rounded border border-cyan-bright/20 bg-ocean-deep/70 p-2 sm:p-3 text-xs sm:text-sm md:text-base text-foreground"
                    multiple
                    size={8}
                    value={notificationRecipients}
                    onChange={(e) =>
                      setNotificationRecipients(
                        Array.from(e.target.selectedOptions, (o) => o.value),
                      )
                    }
                    disabled={sendingNotification}
                  >
                    {allProfiles.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.id} ({user.role})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Hold Ctrl/Cmd to select multiple recipients
                  </p>
                </div>
              )}
              <Button
                onClick={sendNotification}
                disabled={sendingNotification || !notificationMessage.trim()}
                className="w-full sm:w-auto text-xs sm:text-sm md:text-base"
              >
                {sendingNotification ? 'Sending...' : 'Send Notification'}
              </Button>
            </CardContent>
            <CardContent>
              <h3 className="text-md font-semibold mb-2 text-cyan-bright">Sent Notifications</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.length === 0 && (
                  <li className="text-muted-foreground text-sm">No notifications sent yet.</li>
                )}
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="rounded bg-ocean-deep/60 p-2 border border-cyan-bright/10"
                  >
                    <div className="text-foreground text-sm">{n.message}</div>
                    <div className="text-xs text-muted-foreground flex justify-between mt-1">
                      <span>
                        Recipients: {n.recipients.length === 0 ? 'All' : n.recipients.length}
                      </span>
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Admin Dashboard - Comprehensive View */}
        {profile && profile.role === 'admin' && adminViewMode === 'admin' && (
          <div className="space-y-10 overflow-x-hidden max-w-full min-w-0 w-full">
            {/* Admin Quick Actions Hub - Combined from all dashboards */}
            <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full min-w-0">
              <CardHeader className="pb-3 xs:pb-3.5 sm:pb-4">
                <CardTitle className="text-cyan-bright text-base xs:text-lg sm:text-xl">
                  Admin Quick Actions
                </CardTitle>
                <CardDescription className="text-[10px] xs:text-xs sm:text-sm">
                  Everything you need to manage the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                  {/* Support & Communication */}
                  <button
                    onClick={() => navigate('/submit-ticket')}
                    className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40 transition-all active:scale-95"
                  >
                    <HeadphonesIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center leading-tight">
                      Support
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2 py-0.5"
                    >
                      Tickets
                    </Badge>
                  </button>

                  {/* Client Management */}
                  <button
                    onClick={() => setActiveAdminTab('clients')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'clients'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Clients
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {clients.length}
                    </Badge>
                  </button>

                  {/* Lead Management */}
                  <button
                    onClick={() => setActiveAdminTab('leads')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'leads'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center leading-tight">
                      Leads
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2 py-0.5"
                    >
                      {leads.filter((l) => l.status !== 'archived').length}
                    </Badge>
                  </button>

                  {/* Invoice Management */}
                  <button
                    onClick={() => setActiveAdminTab('invoices')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'invoices'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Invoices
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {invoices.length}
                    </Badge>
                  </button>

                  {/* Projects */}
                  <button
                    onClick={() => setActiveAdminTab('dashboard')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'dashboard'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Projects
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {projects.length}
                    </Badge>
                  </button>

                  {/* Forms Management */}
                  <button
                    onClick={() => setActiveAdminTab('intake-forms')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'intake-forms'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Forms
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {intakeForms.length}
                    </Badge>
                  </button>

                  {/* Newsletter */}
                  <button
                    onClick={() => setActiveAdminTab('newsletter')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'newsletter'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Newsletter
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {activeNewsletterSubscribers}
                    </Badge>
                  </button>

                  {/* User Management */}
                  <button
                    onClick={() => setActiveAdminTab('users')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'users'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Users
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {allProfiles.length}
                    </Badge>
                  </button>

                  {/* Payment Tracking */}
                  <button
                    onClick={() => setActiveAdminTab('payments')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'payments'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Payments
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      Tracking
                    </Badge>
                  </button>

                  {/* Calendar Manager */}
                  <button
                    onClick={() => setActiveAdminTab('calendar')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'calendar'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Calendar
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      Bookings
                    </Badge>
                  </button>

                  {/* Analytics Dashboard */}
                  <button
                    onClick={() => setActiveAdminTab('analytics')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'analytics'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Analytics
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      Soon
                    </Badge>
                  </button>

                  {/* Send Notification */}
                  <button
                    onClick={() => setActiveAdminTab('send-notification')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'send-notification'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                      Send Alert
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      New
                    </Badge>
                  </button>

                  {/* Support Tickets */}
                  <button
                    onClick={() => setActiveAdminTab('support-tickets')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'support-tickets'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <HeadphonesIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center leading-tight">
                      Support Tickets
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {tickets.length}
                    </Badge>
                  </button>

                  {/* User Management */}
                  <button
                    onClick={() => setActiveAdminTab('user-management')}
                    className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                      activeAdminTab === 'user-management'
                        ? 'border-cyan-bright bg-cyan-bright/20'
                        : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                    }`}
                  >
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center leading-tight">
                      User Management
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                    >
                      {allProfiles.length}
                    </Badge>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Client Dashboard - Show for clients and admin in client mode */}
        {profile &&
          (profile.role === 'client' ||
            (profile.role === 'admin' && adminViewMode === 'client')) && (
            <div className="space-y-10 overflow-x-hidden max-w-full min-w-0 w-full">
              {profile.role === 'admin' && adminViewMode === 'client' && (
                <Card className="bg-cyan-bright/10 border-cyan-bright/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-cyan-bright">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">Preview Mode: Client Dashboard View</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Quick Actions Hub - Client-specific actions */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full min-w-0">
                <CardHeader>
                  <CardTitle className="text-cyan-bright flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Everything you need, right at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    {/* Common Actions - Available to all roles */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/submit-ticket')}
                    >
                      <HeadphonesIcon className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Submit Support Ticket</div>
                        <div className="text-xs text-muted-foreground">Get help from our team</div>
                      </div>
                    </Button>

                    {/* Client-specific actions */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => {
                        // Scroll to intake form section
                        const intakeSection = document.querySelector('[data-section="intake-form"]')
                        if (intakeSection) {
                          intakeSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                    >
                      <FileText className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">View My Documents</div>
                        <div className="text-xs text-muted-foreground">Intake forms & files</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => {
                        // Scroll to invoices section
                        const invoicesSection = document.querySelector('[data-section="invoices"]')
                        if (invoicesSection) {
                          invoicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                    >
                      <CreditCard className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">View Invoices</div>
                        <div className="text-xs text-muted-foreground">Billing & payments</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/contact')}
                    >
                      <PhoneCall className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Contact Manager</div>
                        <div className="text-xs text-muted-foreground">Direct communication</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* User Notifications Display */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications & Alerts
                  </CardTitle>
                  <CardDescription>Important updates and messages from your team</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications yet</p>
                      <p className="text-sm">You'll see important updates here</p>
                    </div>
                  ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className="rounded-lg bg-ocean-deep/60 p-4 border border-cyan-bright/10"
                        >
                          <div className="text-foreground">{n.message}</div>
                          <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(n.created_at).toLocaleString()}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {n.recipients.length === 0 ? 'Broadcast' : 'Direct'}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Notifications & Alerts Center */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                  <CardHeader>
                    <CardTitle className="text-cyan-bright flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications & Alerts
                    </CardTitle>
                    <CardDescription>Important updates you shouldn't miss</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const upcomingRenewals = subscriptions.filter((sub) => {
                        if (!sub.current_period_end) return false
                        const daysUntil = Math.ceil(
                          (new Date(sub.current_period_end).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                        return daysUntil > 0 && daysUntil <= 30
                      })

                      const pendingInvoices = invoices.filter(
                        (inv) => (inv?.status || '').toString().toLowerCase() !== 'paid',
                      )

                      const recentlyUpdated = projects.filter((proj) => {
                        if (!proj.created_at) return false
                        const daysSince = Math.ceil(
                          (new Date().getTime() - new Date(proj.created_at).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                        return daysSince <= 7
                      })

                      const hasNotifications =
                        upcomingRenewals.length > 0 ||
                        pendingInvoices.length > 0 ||
                        recentlyUpdated.length > 0

                      return hasNotifications ? (
                        <>
                          {upcomingRenewals.map((sub) => {
                            const daysUntil = Math.ceil(
                              (new Date(sub.current_period_end!).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                            return (
                              <div
                                key={sub.id}
                                className="flex items-start gap-3 rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4"
                              >
                                <CalendarDays className="h-5 w-5 text-cyan-bright mt-0.5" />
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground">Renewal Coming Up</p>
                                  <p className="text-sm text-muted-foreground">
                                    Your {sub.plan} subscription renews in {daysUntil} days
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                          {pendingInvoices.slice(0, 2).map((inv) => (
                            <div
                              key={inv.id}
                              className="flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4"
                            >
                              <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">Payment Pending</p>
                                <p className="text-sm text-muted-foreground">
                                  Invoice for ${normalizeAmount(inv.amount).toLocaleString()} due{' '}
                                  {inv.due_date
                                    ? new Date(inv.due_date).toLocaleDateString()
                                    : 'soon'}
                                </p>
                              </div>
                            </div>
                          ))}
                          {recentlyUpdated.slice(0, 2).map((proj) => (
                            <div
                              key={proj.id}
                              className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4"
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">Project Update</p>
                                <p className="text-sm text-muted-foreground">
                                  {proj.name} status updated recently
                                </p>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                          <Bell className="h-8 w-8 text-cyan-bright/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">You're all caught up!</p>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                {/* Recent Activity Feed */}
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                  <CardHeader>
                    <CardTitle className="text-cyan-bright flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your account activity at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const activities: Array<{
                        id: string
                        type: string
                        title: string
                        description: string
                        timestamp: Date
                        icon: typeof FileText
                      }> = []

                      invoices.forEach((inv) => {
                        if (inv.due_date) {
                          activities.push({
                            id: `invoice-${inv.id}`,
                            type: 'invoice',
                            title: 'Invoice Issued',
                            description: `$${normalizeAmount(inv.amount).toLocaleString()} - ${inv.status}`,
                            timestamp: new Date(inv.due_date),
                            icon: FileText,
                          })
                        }
                      })

                      projects.forEach((proj) => {
                        if (proj.created_at) {
                          activities.push({
                            id: `project-${proj.id}`,
                            type: 'project',
                            title: 'Project Updated',
                            description: `${proj.name} - ${proj.status}`,
                            timestamp: new Date(proj.created_at),
                            icon: Briefcase,
                          })
                        }
                      })

                      subscriptions.forEach((sub) => {
                        if (sub.created_at) {
                          activities.push({
                            id: `sub-${sub.id}`,
                            type: 'subscription',
                            title: 'Subscription Active',
                            description: `${sub.plan} - ${sub.status}`,
                            timestamp: new Date(sub.created_at),
                            icon: CreditCard,
                          })
                        }
                      })

                      const sortedActivities = activities
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .slice(0, 5)

                      return sortedActivities.length > 0 ? (
                        sortedActivities.map((activity) => {
                          const Icon = activity.icon
                          const timeAgo = Math.floor(
                            (new Date().getTime() - activity.timestamp.getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                          return (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3 rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-3"
                            >
                              <Icon className="h-4 w-4 text-cyan-bright mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-cyan-soft mt-1">
                                  {timeAgo === 0
                                    ? 'Today'
                                    : `${timeAgo} day${timeAgo > 1 ? 's' : ''} ago`}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                          <Activity className="h-8 w-8 text-cyan-bright/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* My Support Tickets - For Users and Clients */}
              {profile?.role === 'client' && (
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                  <CardHeader>
                    <CardTitle className="text-cyan-bright flex items-center gap-2">
                      <HeadphonesIcon className="h-5 w-5" />
                      My Support Tickets
                    </CardTitle>
                    <CardDescription>Track your support requests and responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tickets.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <HeadphonesIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No support tickets yet</p>
                        <p className="text-sm mt-2 mb-6">
                          Need help? Submit a ticket using the Quick Actions above
                        </p>
                        <Button
                          onClick={() => navigate('/submit-ticket')}
                          className="bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
                        >
                          <HeadphonesIcon className="h-4 w-4 mr-2" />
                          Submit Your First Ticket
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            variant="outline"
                            className="border-cyan-bright/50 text-cyan-bright"
                          >
                            {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => navigate('/submit-ticket')}
                            className="bg-cyan-bright/10 text-cyan-bright hover:bg-cyan-bright/20 border border-cyan-bright/20"
                          >
                            <HeadphonesIcon className="h-3 w-3 mr-2" />
                            New Ticket
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {tickets.slice(0, 5).map((ticket) => (
                            <div
                              key={ticket.id}
                              className="p-4 rounded-lg bg-ocean-deep/60 border border-cyan-bright/10 hover:border-cyan-bright/30 transition-all cursor-pointer"
                              onClick={() => {
                                setSelectedTicket(ticket)
                                loadTicketResponses(ticket.id)
                              }}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="font-semibold text-foreground line-clamp-1">
                                  {ticket.title}
                                </h3>
                                <Badge
                                  variant={
                                    ticket.status === 'open'
                                      ? 'default'
                                      : ticket.status === 'in_progress'
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                  className="shrink-0"
                                >
                                  {ticket.status === 'open'
                                    ? '🔵 Open'
                                    : ticket.status === 'in_progress'
                                      ? '🟡 In Progress'
                                      : ticket.status === 'resolved'
                                        ? '✅ Resolved'
                                        : '⚪ Closed'}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {ticket.description}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(ticket.created_at).toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {ticket.category || 'general'}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    ticket.priority === 'urgent'
                                      ? 'border-red-500 text-red-500'
                                      : ticket.priority === 'high'
                                        ? 'border-orange-500 text-orange-500'
                                        : ticket.priority === 'medium'
                                          ? 'border-yellow-500 text-yellow-500'
                                          : 'border-green-500 text-green-500'
                                  }`}
                                >
                                  {ticket.priority || 'medium'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {tickets.length > 5 && (
                          <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground">
                              Showing 5 of {tickets.length} tickets
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* My Invoices - For Users and Clients */}
              {profile?.role === 'client' && (
                <div data-section="invoices">
                  <InvoiceViewer />
                </div>
              )}

              {/* My Intake Form - For Users and Clients */}
              {profile?.role === 'client' && (
                <div data-section="intake-form">
                  <IntakeViewer />
                </div>
              )}

              {/* Service Usage Metrics (hidden for now, can be re-enabled later) */}
              {/**
            <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
              <CardHeader>
                <CardTitle className="text-cyan-bright flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Service Usage & Performance
                </CardTitle>
                <CardDescription>Monitor your service consumption and uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Database className="h-5 w-5 text-cyan-bright" />
                      <Badge variant="outline" className="border-cyan-bright/40 text-cyan-bright">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Storage</p>
                    <p className="text-2xl font-bold text-foreground mt-1">24.3 GB</p>
                    <Progress value={45} className="mt-3 h-2" />
                    <p className="text-xs text-muted-foreground mt-2">45% of 50 GB limit</p>
                  </div>

                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Zap className="h-5 w-5 text-cyan-bright" />
                      <Badge variant="outline" className="border-green-500/40 text-green-400">
                        99.9%
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Uptime</p>
                    <p className="text-2xl font-bold text-foreground mt-1">30 Days</p>
                    <Progress value={99.9} className="mt-3 h-2" />
                    <p className="text-xs text-muted-foreground mt-2">Excellent reliability</p>
                  </div>

                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Server className="h-5 w-5 text-cyan-bright" />
                      <Badge variant="outline" className="border-cyan-bright/40 text-cyan-bright">
                        This Month
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">API Calls</p>
                    <p className="text-2xl font-bold text-foreground mt-1">127.5K</p>
                    <Progress value={63} className="mt-3 h-2" />
                    <p className="text-xs text-muted-foreground mt-2">63% of 200K limit</p>
                  </div>

                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingUp className="h-5 w-5 text-cyan-bright" />
                      <Badge variant="outline" className="border-cyan-bright/40 text-cyan-bright">
                        Total
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Bandwidth</p>
                    <p className="text-2xl font-bold text-foreground mt-1">156 GB</p>
                    <Progress value={31} className="mt-3 h-2" />
                    <p className="text-xs text-muted-foreground mt-2">31% of 500 GB limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            */}

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                  <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-cyan-bright">Projects Timeline</CardTitle>
                      <CardDescription>
                        Latest status updates across your initiatives.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                      {projects.length} total projects
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects.length > 0 ? (
                      <ul className="space-y-3">
                        {projects.map((project) => {
                          const status = (project?.status || '').toString().toLowerCase()
                          const isActive = ['active', 'in-progress', 'ongoing'].includes(status)
                          const isCompleted = ['completed', 'done', 'finished'].includes(status)

                          // Calculate progress based on status
                          const progress = isCompleted ? 100 : isActive ? 65 : 30

                          // Calculate days since creation
                          const daysSinceCreated = project.created_at
                            ? Math.floor(
                                (new Date().getTime() - new Date(project.created_at).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )
                            : null

                          return (
                            <li
                              key={project.id}
                              className="group relative overflow-hidden rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-5 transition-all duration-300 hover:border-cyan-bright/40 hover:shadow-lg hover:shadow-cyan-bright/10"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-bright/0 via-cyan-bright/5 to-cyan-bright/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              <div className="relative space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                      <Briefcase className="h-5 w-5 text-cyan-bright mt-0.5" />
                                      <div>
                                        <p className="text-lg font-semibold text-foreground">
                                          {project.name}
                                        </p>
                                        {project.description ? (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {project.description}
                                          </p>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      isCompleted ? 'outline' : isActive ? 'default' : 'secondary'
                                    }
                                    className="capitalize shrink-0"
                                  >
                                    {status || 'N/A'}
                                  </Badge>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold text-cyan-bright">
                                      {progress}%
                                    </span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>

                                {/* Project Meta Information */}
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  {daysSinceCreated !== null && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>Started {daysSinceCreated} days ago</span>
                                    </div>
                                  )}
                                  {project.monthly_fee && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>
                                        ${normalizeAmount(project.monthly_fee).toLocaleString()}/mo
                                      </span>
                                    </div>
                                  )}
                                  {project.notes && (
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      <span className="truncate max-w-[200px]">
                                        {project.notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-8 text-center">
                        <Briefcase className="h-12 w-12 text-cyan-bright/40 mx-auto mb-3" />
                        <p className="text-lg font-semibold text-foreground">
                          No projects launched yet
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          Kickstart a deployment to see it appear here.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-cyan-bright/40 text-cyan-bright"
                        >
                          Start Your First Project
                        </Button>
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
                      subscriptions.map((subscription) => {
                        const daysUntilRenewal = subscription.current_period_end
                          ? Math.ceil(
                              (new Date(subscription.current_period_end).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                          : null

                        const isActive =
                          (subscription?.status || '').toString().toLowerCase() === 'active'

                        return (
                          <div
                            key={subscription.id}
                            className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 p-4 space-y-4"
                          >
                            <div>
                              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
                                Plan
                              </p>
                              <p className="text-xl font-semibold text-foreground">
                                {subscription.plan || 'Custom'}
                              </p>
                            </div>

                            <Separator className="bg-cyan-bright/20" />

                            <div className="space-y-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">Status</span>
                                <Badge
                                  variant={isActive ? 'default' : 'secondary'}
                                  className="capitalize"
                                >
                                  {subscription.status || 'Unknown'}
                                </Badge>
                              </div>

                              {subscription.current_period_end && (
                                <>
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                      Next billing
                                    </span>
                                    <span>
                                      {new Date(
                                        subscription.current_period_end,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {daysUntilRenewal !== null && daysUntilRenewal > 0 && (
                                    <div className="rounded-lg bg-cyan-bright/10 border border-cyan-bright/20 p-3 mt-3">
                                      <div className="flex items-center gap-2 justify-center">
                                        <CalendarDays className="h-4 w-4 text-cyan-bright" />
                                        <span className="font-semibold text-cyan-bright">
                                          {daysUntilRenewal} day{daysUntilRenewal > 1 ? 's' : ''}{' '}
                                          until renewal
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {subscription.price && (
                                <div className="flex items-center justify-between pt-2 border-t border-cyan-bright/10">
                                  <span className="font-semibold text-foreground">
                                    Monthly Rate
                                  </span>
                                  <span className="text-lg font-bold text-cyan-bright">
                                    ${normalizeAmount(subscription.price).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-6 text-center">
                        <CreditCard className="h-10 w-10 text-cyan-bright/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No active subscription detected. Reach out to tailor the perfect plan.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyan-bright/40 text-cyan-bright"
                        >
                          Explore Plans
                        </Button>
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
                        <AreaChart
                          data={invoiceChartData}
                          margin={{ left: 12, right: 12, bottom: 8 }}
                        >
                          <defs>
                            <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeOpacity={0.15} strokeDasharray="3 3" />
                          <XAxis
                            dataKey="label"
                            stroke="hsla(0,0%,100%,0.4)"
                            tickLine={false}
                            axisLine={false}
                          />
                          <RechartsTooltip
                            content={<ChartTooltipContent hideIndicator />}
                            cursor={{ stroke: '#22d3ee', strokeOpacity: 0.2 }}
                          />
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
                    <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 overflow-x-auto">
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
                              <TableCell>
                                {invoice.due_date
                                  ? new Date(invoice.due_date).toLocaleDateString()
                                  : '—'}
                              </TableCell>
                              <TableCell>
                                ${normalizeAmount(invoice.amount).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    (invoice?.status || '').toString().toLowerCase() === 'paid'
                                      ? 'default'
                                      : 'secondary'
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

        {/* User Dashboard - Show for general users (not clients) and admin in user mode */}
        {profile &&
          (profile.role === 'user' || (profile.role === 'admin' && adminViewMode === 'user')) && (
            <div className="space-y-10 overflow-x-hidden max-w-full min-w-0 w-full">
              {profile.role === 'admin' && adminViewMode === 'user' && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">Preview Mode: User Dashboard View</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Quick Actions Hub - User-specific */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full min-w-0">
                <CardHeader>
                  <CardTitle className="text-cyan-bright flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Get started with our services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {/* Submit Support Ticket */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/submit-ticket')}
                    >
                      <HeadphonesIcon className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Submit Support Ticket</div>
                        <div className="text-xs text-muted-foreground">Get help from our team</div>
                      </div>
                    </Button>

                    {/* Browse Services */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/services')}
                    >
                      <BookOpen className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Browse Services</div>
                        <div className="text-xs text-muted-foreground">Explore what we offer</div>
                      </div>
                    </Button>

                    {/* View My Invoices */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => {
                        // Scroll to invoices section
                        const invoicesSection = document.querySelector(
                          '[data-section="user-invoices"]',
                        )
                        if (invoicesSection) {
                          invoicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                    >
                      <CreditCard className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">View My Invoices</div>
                        <div className="text-xs text-muted-foreground">Billing & payments</div>
                      </div>
                    </Button>

                    {/* Become a Client */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/contact')}
                    >
                      <UserPlus className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Become a Client</div>
                        <div className="text-xs text-muted-foreground">Upgrade your account</div>
                      </div>
                    </Button>

                    {/* Fill Out Intake Form */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => navigate('/intake')}
                    >
                      <FileText className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Fill Intake Form</div>
                        <div className="text-xs text-muted-foreground">Complete your profile</div>
                      </div>
                    </Button>

                    {/* View My Documents */}
                    <Button
                      variant="outline"
                      className="h-auto flex-col items-start gap-3 p-4 border-cyan-bright/20 hover:border-cyan-bright/50 hover:bg-cyan-bright/5"
                      onClick={() => {
                        // Scroll to intake form section
                        const intakeSection = document.querySelector(
                          '[data-section="user-intake-form"]',
                        )
                        if (intakeSection) {
                          intakeSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                    >
                      <FileText className="h-6 w-6 text-cyan-bright" />
                      <div className="text-left">
                        <div className="font-semibold text-foreground">View My Documents</div>
                        <div className="text-xs text-muted-foreground">Intake forms & files</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Welcome Card for Users */}
              <Card className="bg-gradient-to-br from-cyan-bright/10 to-ocean-surface/60 border-cyan-bright/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-cyan-bright text-2xl">Welcome to Dolonia!</CardTitle>
                  <CardDescription className="text-base">
                    You're currently exploring our platform. Ready to unlock the full potential?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Access to Support</p>
                        <p className="text-sm text-muted-foreground">
                          Get help whenever you need it through our support system
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Explore Services</p>
                        <p className="text-sm text-muted-foreground">
                          Browse our full catalog of cloud and tech solutions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Upgrade to Client</p>
                        <p className="text-sm text-muted-foreground">
                          Become a client to access projects, invoices, and dedicated support
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      className="w-full bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
                      onClick={() => navigate('/contact')}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request Client Access
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* User Notifications Display */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications & Alerts
                  </CardTitle>
                  <CardDescription>Important updates and messages</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications yet</p>
                      <p className="text-sm">You'll see important updates here</p>
                    </div>
                  ) : (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className="rounded-xl border border-cyan-bright/10 bg-ocean-deep/60 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Bell className="h-5 w-5 text-cyan-bright mt-1" />
                            <div className="flex-1">
                              <div className="text-foreground mb-1">{n.message}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(n.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* My Invoices - For Users */}
              <div data-section="user-invoices">
                <InvoiceViewer />
              </div>

              {/* My Intake Form - For Users */}
              <div data-section="user-intake-form">
                <IntakeViewer />
              </div>
            </div>
          )}

        {/* Team Member Dashboard - Show for team members and admin in team mode */}
        {profile &&
          (profile.role === 'team_member' ||
            (profile.role === 'admin' && adminViewMode === 'team')) && (
            <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 overflow-x-hidden max-w-full min-w-0 w-full">
              {profile.role === 'admin' && adminViewMode === 'team' && (
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">
                        Preview Mode: Team Member Dashboard View
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Quick Actions Dashboard - 2 columns on mobile, 3 on tablet+ */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10 overflow-hidden max-w-full min-w-0">
                <CardHeader className="pb-3 xs:pb-3.5 sm:pb-4">
                  <CardTitle className="text-cyan-bright text-base xs:text-lg sm:text-xl">
                    Team Member Quick Actions
                  </CardTitle>
                  <CardDescription className="text-[10px] xs:text-xs sm:text-sm">
                    Your workspace and tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    {/* Lead Management */}
                    <button
                      onClick={() => setActiveAdminTab('leads')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'leads'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center leading-tight">
                        Leads
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs sm:text-xs border-cyan-bright/50 text-cyan-bright px-2 py-0.5"
                      >
                        {leads.filter((l) => l.status !== 'archived').length}
                      </Badge>
                    </button>

                    {/* Client Management */}
                    <button
                      onClick={() => setActiveAdminTab('clients')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'clients'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Clients
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        {clients.length}
                      </Badge>
                    </button>

                    {/* User Management */}
                    <button
                      onClick={() => setActiveAdminTab('dashboard')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'dashboard'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Users
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        {allProfiles.length}
                      </Badge>
                    </button>

                    {/* Invoices */}
                    <button
                      onClick={() => setActiveAdminTab('invoices')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'invoices'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Invoices
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        {invoices.length}
                      </Badge>
                    </button>

                    {/* Intake Forms */}
                    <button
                      onClick={() => setActiveAdminTab('intake-forms')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'intake-forms'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Forms
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        {intakeForms.length}
                      </Badge>
                    </button>

                    {/* Newsletter */}
                    <button
                      onClick={() => setActiveAdminTab('newsletter')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'newsletter'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Newsletter
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        {activeNewsletterSubscribers}
                      </Badge>
                    </button>

                    {/* Send Notification */}
                    <button
                      onClick={() => setActiveAdminTab('notifications')}
                      className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'notifications'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Bell className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-cyan-bright" />
                      <span className="text-xs sm:text-sm md:text-base font-medium text-foreground text-center">
                        Notify
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-cyan-bright/50 text-cyan-bright px-1.5 sm:px-2"
                      >
                        Send
                      </Badge>
                    </button>

                    {/* Settings (new addition) */}
                    <button
                      onClick={() => setActiveAdminTab('dashboard')}
                      className={`flex flex-col items-center justify-center gap-2 sm:gap-2 p-4 sm:p-4 md:p-5 rounded-xl border-2 transition-all active:scale-95 ${
                        activeAdminTab === 'dashboard'
                          ? 'border-cyan-bright bg-cyan-bright/20'
                          : 'border-cyan-bright/20 bg-ocean-deep/40 hover:bg-ocean-deep/60 hover:border-cyan-bright/40'
                      }`}
                    >
                      <Settings className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-cyan-bright" />
                      <span className="text-sm sm:text-sm md:text-base font-medium text-foreground text-center">
                        Settings
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs sm:text-xs border-cyan-bright/50 text-cyan-bright px-2"
                      >
                        Manage
                      </Badge>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Overview - Only show on desktop or when NOT on dashboard tab */}
              {activeAdminTab === 'dashboard' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Total Leads</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                          {leads.length}
                        </p>
                        <p className="text-[9px] sm:text-xs text-green-400">+{todaysLeads} today</p>
                      </div>
                    </Card>

                    <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Active Clients
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                          {clients.length}
                        </p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground">Onboarded</p>
                      </div>
                    </Card>

                    <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Pending Forms
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                          {pendingIntakeForms}
                        </p>
                        <p className="text-[9px] sm:text-xs text-orange-400">Need review</p>
                      </div>
                    </Card>

                    <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Invoices</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                          {invoices.length}
                        </p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground">Total</p>
                      </div>
                    </Card>
                  </div>

                  {/* Room Booking Calendar */}
                  <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                    <CardHeader>
                      <CardTitle className="text-cyan-bright">Room Booking Calendar</CardTitle>
                      <CardDescription>Schedule and manage meeting room bookings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <RoomBookingDashboard />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

        {/* Admin Tab Content - Projects/Dashboard with Room Booking Calendar */}
        {profile &&
          profile.role === 'admin' &&
          adminViewMode === 'admin' &&
          activeAdminTab === 'dashboard' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                  Projects & Room Booking
                </h2>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Total Projects</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      {projects.length}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground">Active</p>
                  </div>
                </Card>

                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Active Clients</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      {clients.length}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground">Onboarded</p>
                  </div>
                </Card>

                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Total Leads</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      {leads.length}
                    </p>
                    <p className="text-[9px] sm:text-xs text-green-400">Pipeline</p>
                  </div>
                </Card>

                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-2 sm:p-3 md:p-4">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Invoices</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      {invoices.length}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground">Total</p>
                  </div>
                </Card>
              </div>

              {/* Room Booking Calendar */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright">Room Booking Calendar</CardTitle>
                  <CardDescription>Schedule and manage meeting room bookings</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RoomBookingDashboard />
                </CardContent>
              </Card>
            </div>
          )}

        {/* Admin Tab Content - Leads */}
        {profile &&
          isStaff(profile.role) &&
          adminViewMode === 'admin' &&
          activeAdminTab === 'leads' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                  Lead Management
                </h2>
                <Button
                  onClick={() => setActiveAdminTab('dashboard')}
                  variant="outline"
                  className="border-cyan-bright/20 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">← Back to Dashboard</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </div>

              {/* Leads Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold text-cyan-bright">{leads.length}</p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-400">
                      {leads.filter((l) => l.status !== 'archived').length}
                    </p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">New</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {leads.filter((l) => l.status === 'new').length}
                    </p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Archived</p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {leads.filter((l) => l.status === 'archived').length}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Leads Table */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright">All Leads</CardTitle>
                  <CardDescription>Manage and track all incoming leads</CardDescription>
                </CardHeader>
                <CardContent>
                  {leads.filter((l) => l.status !== 'archived').length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-8 text-center">
                      <p className="text-muted-foreground">No active leads yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-cyan-bright/10">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2">Name</TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden sm:table-cell">
                              Email
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2">
                              Status
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden md:table-cell">
                              Source
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden lg:table-cell">
                              Date
                            </TableHead>
                            <TableHead className="text-cyan-soft text-right text-xs px-2 py-2">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leads
                            .filter((l) => l.status !== 'archived')
                            .map((lead) => (
                              <TableRow key={lead.id}>
                                <TableCell className="font-medium text-foreground text-xs px-2 py-2">
                                  {lead.name || 'Unnamed Lead'}
                                </TableCell>
                                <TableCell className="text-xs px-2 py-2 hidden sm:table-cell">
                                  <span className="text-cyan-soft truncate max-w-[200px] block">
                                    {lead.email || 'No email'}
                                  </span>
                                </TableCell>
                                <TableCell className="px-2 py-2">
                                  <Badge
                                    className="capitalize text-[8px] sm:text-xs whitespace-nowrap"
                                    variant={
                                      lead.status === 'new'
                                        ? 'default'
                                        : lead.status === 'contacted'
                                          ? 'secondary'
                                          : 'outline'
                                    }
                                  >
                                    {lead.status || 'new'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs px-2 py-2 hidden md:table-cell">
                                  {lead.source || 'Website'}
                                </TableCell>
                                <TableCell className="text-xs px-2 py-2 hidden lg:table-cell">
                                  {lead.created_at
                                    ? new Date(lead.created_at).toLocaleDateString()
                                    : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right px-2 py-2">
                                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                                    <Button
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={async () => {
                                        try {
                                          const newStatus =
                                            lead.status === 'new'
                                              ? 'contacted'
                                              : lead.status === 'contacted'
                                                ? 'converted'
                                                : 'new'
                                          const { error } = await supabase
                                            .from('leads')
                                            .update({ status: newStatus })
                                            .eq('id', Number(lead.id))

                                          if (error) throw error

                                          const { data } = await supabase
                                            .from('leads')
                                            .select('*')
                                            .order('created_at', { ascending: false })
                                          if (data) setLeads(data as Lead[])

                                          toast.success(`Lead marked as ${newStatus}`)
                                        } catch (error) {
                                          toast.error('Failed to update lead')
                                        }
                                      }}
                                    >
                                      <CheckCircle2 className="h-3 w-3 text-green-400" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={async () => {
                                        if (
                                          !confirm(`Archive lead from ${lead.name || 'Unnamed'}?`)
                                        )
                                          return
                                        try {
                                          const { error } = await supabase
                                            .from('leads')
                                            .update({ status: 'archived' })
                                            .eq('id', Number(lead.id))

                                          if (error) throw error

                                          const { data } = await supabase
                                            .from('leads')
                                            .select('*')
                                            .order('created_at', { ascending: false })
                                          if (data) setLeads(data as Lead[])

                                          toast.success('Lead archived')
                                        } catch (error) {
                                          toast.error('Failed to archive lead')
                                        }
                                      }}
                                    >
                                      <Archive className="h-3 w-3 text-orange-400" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={async () => {
                                        if (
                                          !confirm(
                                            `Delete lead from ${lead.name || 'Unnamed'}? This cannot be undone.`,
                                          )
                                        )
                                          return
                                        try {
                                          const { error } = await supabase
                                            .from('leads')
                                            .delete()
                                            .eq('id', Number(lead.id))

                                          if (error) throw error

                                          const { data } = await supabase
                                            .from('leads')
                                            .select('*')
                                            .order('created_at', { ascending: false })
                                          if (data) setLeads(data as Lead[])

                                          toast.success('Lead deleted')
                                        } catch (error) {
                                          toast.error('Failed to delete lead')
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-400" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        {/* Admin Tab Content - Clients */}
        {profile &&
          isStaff(profile.role) &&
          adminViewMode === 'admin' &&
          activeAdminTab === 'clients' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                  Client Management
                </h2>
                <Button
                  onClick={() => setActiveAdminTab('dashboard')}
                  variant="outline"
                  className="border-cyan-bright/20 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">← Back to Dashboard</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </div>

              {/* Clients Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold text-cyan-bright">{clients.length}</p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-400">
                      {
                        clients.filter((c) =>
                          ['active', 'engaged', 'priority'].includes(
                            (c.status || '').toLowerCase(),
                          ),
                        ).length
                      }
                    </p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold text-cyan-bright">{projects.length}</p>
                  </div>
                </Card>
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-green-400">
                      $
                      {invoices
                        .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Clients Table */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10">
                <CardHeader>
                  <CardTitle className="text-cyan-bright">All Clients</CardTitle>
                  <CardDescription>Manage your active client relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  {clients.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-cyan-bright/20 bg-ocean-deep/40 p-8 text-center">
                      <p className="text-muted-foreground">No clients yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-cyan-bright/10">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2">
                              Company
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden sm:table-cell">
                              Contact
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden md:table-cell">
                              Phone
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2">
                              Status
                            </TableHead>
                            <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden lg:table-cell">
                              Since
                            </TableHead>
                            <TableHead className="text-cyan-soft text-right text-xs px-2 py-2">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clients.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell className="font-medium text-foreground text-xs px-2 py-2">
                                {client.company || client.name || 'Unnamed Client'}
                              </TableCell>
                              <TableCell className="text-xs px-2 py-2 hidden sm:table-cell">
                                <span className="text-cyan-soft">
                                  {client.contact_name || 'N/A'}
                                </span>
                              </TableCell>
                              <TableCell className="text-xs px-2 py-2 hidden md:table-cell">
                                {client.phone || 'N/A'}
                              </TableCell>
                              <TableCell className="px-2 py-2">
                                <Badge
                                  className="capitalize text-[8px] sm:text-xs whitespace-nowrap"
                                  variant={
                                    ['active', 'engaged', 'priority'].includes(
                                      (client.status || '').toLowerCase(),
                                    )
                                      ? 'default'
                                      : 'outline'
                                  }
                                >
                                  {client.status || 'active'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs px-2 py-2 hidden lg:table-cell">
                                {client.created_at
                                  ? new Date(client.created_at).toLocaleDateString()
                                  : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right px-2 py-2">
                                <div className="flex items-center justify-end gap-1 sm:gap-2">
                                  <Button
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      toast.info('Client details view coming soon')
                                    }}
                                  >
                                    <Eye className="h-3 w-3 text-cyan-bright" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      toast.info('Client editing coming soon')
                                    }}
                                  >
                                    <Edit className="h-3 w-3 text-orange-400" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={async () => {
                                      if (
                                        !confirm(
                                          `Delete client ${client.company || client.name || 'Unnamed'}? This cannot be undone.`,
                                        )
                                      )
                                        return
                                      try {
                                        const { error } = await supabase
                                          .from('clients')
                                          .delete()
                                          .eq('id', Number(client.id))

                                        if (error) throw error

                                        const { data } = await supabase
                                          .from('clients')
                                          .select('*')
                                          .order('created_at', { ascending: false })
                                        if (data) setClients(data as Client[])

                                        toast.success('Client deleted')
                                      } catch (error) {
                                        toast.error('Failed to delete client')
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-400" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        {/* Admin Tab Content - Invoices */}
        {profile &&
          isStaff(profile.role) &&
          adminViewMode === 'admin' &&
          activeAdminTab === 'invoices' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                  Invoice Management
                </h2>
                <Button
                  onClick={() => setActiveAdminTab('dashboard')}
                  variant="outline"
                  className="border-cyan-bright/20 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">← Back</span>
                  <span className="sm:hidden">←</span>
                </Button>
              </div>
              <InvoiceCreator
                onInvoiceCreated={async () => {
                  const { data } = await supabase
                    .from('invoices')
                    .select('*')
                    .order('due_date', { ascending: false })
                  if (data) setInvoices(data as Invoice[])
                }}
              />
            </div>
          )}

        {/* Admin Tab Content - Intake Forms */}
        {profile &&
          isStaff(profile.role) &&
          adminViewMode === 'admin' &&
          activeAdminTab === 'intake-forms' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header with Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                    Intake Forms Library
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {intakeForms.filter((f) => f.status !== 'archived').length} active •{' '}
                    {intakeForms.filter((f) => f.status === 'archived').length} archived
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={async () => {
                      try {
                        // Create CSV content
                        const headers = [
                          'Name',
                          'Email',
                          'Company',
                          'Phone',
                          'Division',
                          'Service Category',
                          'Budget',
                          'Timeline',
                          'Status',
                          'Submitted',
                        ]
                        const rows = intakeForms.map((form) => [
                          form.full_name,
                          form.email,
                          form.company_name || '',
                          form.phone || '',
                          form.division,
                          form.service_category,
                          form.budget_range || form.custom_budget || '',
                          form.timeline || '',
                          form.status,
                          new Date(form.created_at).toLocaleDateString(),
                        ])

                        const csv = [
                          headers.join(','),
                          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
                        ].join('\n')

                        // Download CSV
                        const blob = new Blob([csv], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `intake-forms-${new Date().toISOString().split('T')[0]}.csv`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        window.URL.revokeObjectURL(url)

                        toast.success('Forms exported successfully')
                      } catch (error) {
                        toast.error('Failed to export forms')
                      }
                    }}
                    variant="outline"
                    className="border-cyan-bright/20 text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={() => setActiveAdminTab('dashboard')}
                    variant="outline"
                    className="border-cyan-bright/20 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">← Back</span>
                    <span className="sm:hidden">←</span>
                  </Button>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <Card className="bg-ocean-surface/60 border-cyan-bright/10">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={formSearchQuery}
                        onChange={(e) => setFormSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-ocean-deep border border-cyan-bright/20 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-bright/40"
                      />
                    </div>

                    {/* Status Filter */}
                    <Select value={formStatusFilter} onValueChange={setFormStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-ocean-deep border-cyan-bright/20">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-ocean-deep border-cyan-bright/20">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Division Filter */}
                    <Select value={formDivisionFilter} onValueChange={setFormDivisionFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-ocean-deep border-cyan-bright/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-ocean-deep border-cyan-bright/20">
                        <SelectItem value="all">All Divisions</SelectItem>
                        <SelectItem value="cloud_migration">Cloud Migration</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="data_analytics">Data Analytics</SelectItem>
                        <SelectItem value="custom_development">Custom Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {intakeForms.length === 0 ? (
                <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    No intake forms received yet
                  </p>
                </Card>
              ) : (
                <>
                  {/* Forms Table/Library View */}
                  <Card className="bg-ocean-surface/60 border-cyan-bright/10">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table className="text-xs">
                          <TableHeader>
                            <TableRow className="border-cyan-bright/10">
                              <TableHead className="text-cyan-soft text-xs px-3 py-3">
                                Applicant
                              </TableHead>
                              <TableHead className="text-cyan-soft text-xs px-3 py-3 hidden md:table-cell">
                                Company
                              </TableHead>
                              <TableHead className="text-cyan-soft text-xs px-3 py-3 hidden lg:table-cell">
                                Division
                              </TableHead>
                              <TableHead className="text-cyan-soft text-xs px-3 py-3">
                                Status
                              </TableHead>
                              <TableHead className="text-cyan-soft text-xs px-3 py-3 hidden sm:table-cell">
                                Submitted
                              </TableHead>
                              <TableHead className="text-cyan-soft text-right text-xs px-3 py-3">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {intakeForms
                              .filter((form) => {
                                // Status filter
                                if (formStatusFilter !== 'all' && form.status !== formStatusFilter)
                                  return false

                                // Division filter
                                if (
                                  formDivisionFilter !== 'all' &&
                                  form.division !== formDivisionFilter
                                )
                                  return false

                                // Search filter
                                if (formSearchQuery) {
                                  const query = formSearchQuery.toLowerCase()
                                  return (
                                    form.full_name.toLowerCase().includes(query) ||
                                    form.email.toLowerCase().includes(query) ||
                                    (form.company_name || '').toLowerCase().includes(query)
                                  )
                                }

                                return true
                              })
                              .map((form) => (
                                <TableRow
                                  key={form.id}
                                  className={`border-cyan-bright/10 hover:bg-ocean-deep/40 ${
                                    form.status === 'new' ? 'bg-orange-400/5' : ''
                                  } ${form.status === 'archived' ? 'opacity-60' : ''}`}
                                >
                                  <TableCell className="px-3 py-3">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-foreground text-xs sm:text-sm">
                                        {form.full_name}
                                      </span>
                                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[200px]">
                                        {form.email}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="px-3 py-3 hidden md:table-cell">
                                    <span className="text-xs text-cyan-soft">
                                      {form.company_name || '—'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="px-3 py-3 hidden lg:table-cell">
                                    <span className="text-xs capitalize">
                                      {form.division?.replace(/_/g, ' ') || '—'}
                                    </span>
                                  </TableCell>
                                  <TableCell className="px-3 py-3">
                                    <Badge
                                      className={`text-[10px] sm:text-xs ${
                                        form.status === 'new'
                                          ? 'bg-orange-400/20 text-orange-400 border-orange-400/50'
                                          : form.status === 'reviewing'
                                            ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50'
                                            : form.status === 'archived'
                                              ? 'bg-gray-400/20 text-gray-400 border-gray-400/50'
                                              : 'bg-green-400/20 text-green-400 border-green-400/50'
                                      }`}
                                    >
                                      {form.status === 'new'
                                        ? '🔴 New'
                                        : form.status === 'reviewing'
                                          ? '🟡 Review'
                                          : form.status === 'archived'
                                            ? '📦 Archive'
                                            : '✅ Done'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="px-3 py-3 hidden sm:table-cell">
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(form.created_at).toLocaleDateString()}
                                    </span>
                                  </TableCell>
                                  <TableCell
                                    className="px-3 py-3 text-right"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setIntakeFormEditing(form)
                                          setIntakeFormEditNotes(form.notes || '')
                                          setIntakeFormEditDialogOpen(true)
                                        }}
                                      >
                                        <Eye className="h-3 w-3 text-cyan-bright" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={async (e) => {
                                          e.stopPropagation()
                                          try {
                                            const newStatus =
                                              form.status === 'archived' ? 'new' : 'archived'
                                            const { error } = await supabase
                                              .from('intake_forms')
                                              .update({ status: newStatus })
                                              .eq('id', form.id)

                                            if (error) throw error

                                            const { data } = await supabase
                                              .from('intake_forms')
                                              .select('*')
                                              .order('created_at', { ascending: false })
                                            if (data) setIntakeForms(data as IntakeForm[])

                                            toast.success(
                                              newStatus === 'archived'
                                                ? 'Form archived'
                                                : 'Form restored',
                                            )
                                          } catch (error) {
                                            toast.error('Failed to update form')
                                          }
                                        }}
                                      >
                                        <Archive
                                          className={`h-3 w-3 ${form.status === 'archived' ? 'text-green-400' : 'text-orange-400'}`}
                                        />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                        onClick={async (e) => {
                                          e.stopPropagation()
                                          if (
                                            !confirm(
                                              `Delete form from ${form.full_name}? This cannot be undone.`,
                                            )
                                          )
                                            return
                                          try {
                                            const { error } = await supabase
                                              .from('intake_forms')
                                              .delete()
                                              .eq('id', form.id)

                                            if (error) throw error

                                            const { data } = await supabase
                                              .from('intake_forms')
                                              .select('*')
                                              .order('created_at', { ascending: false })
                                            if (data) setIntakeForms(data as IntakeForm[])

                                            toast.success('Form deleted')
                                          } catch (error) {
                                            toast.error('Failed to delete form')
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3 text-red-400" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* No Results Message */}
                  {intakeForms.filter((form) => {
                    if (formStatusFilter !== 'all' && form.status !== formStatusFilter) return false
                    if (formDivisionFilter !== 'all' && form.division !== formDivisionFilter)
                      return false
                    if (formSearchQuery) {
                      const query = formSearchQuery.toLowerCase()
                      return (
                        form.full_name.toLowerCase().includes(query) ||
                        form.email.toLowerCase().includes(query) ||
                        (form.company_name || '').toLowerCase().includes(query)
                      )
                    }
                    return true
                  }).length === 0 && (
                    <Card className="bg-ocean-surface/60 border-cyan-bright/10 p-6 text-center">
                      <p className="text-muted-foreground text-sm">
                        No forms match your filters. Try adjusting your search.
                      </p>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

        {/* Intake Form Detail Dialog */}
        {intakeFormEditing && (
          <Dialog open={intakeFormEditDialogOpen} onOpenChange={setIntakeFormEditDialogOpen}>
            <DialogContent className="bg-ocean-deep border-cyan-bright/20 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-cyan-bright">
                  {intakeFormEditing.full_name}
                </DialogTitle>
                <DialogDescription>
                  Submitted {new Date(intakeFormEditing.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm text-foreground">{intakeFormEditing.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="text-sm text-foreground">{intakeFormEditing.phone || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Company</Label>
                    <p className="text-sm text-foreground">
                      {intakeFormEditing.company_name || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Division</Label>
                    <p className="text-sm text-foreground capitalize">
                      {intakeFormEditing.division?.replace(/_/g, ' ') || '—'}
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <Separator className="bg-cyan-bright/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Service Category</Label>
                    <p className="text-sm text-foreground">
                      {intakeFormEditing.service_category || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Budget Range</Label>
                    <p className="text-sm text-foreground">
                      {intakeFormEditing.budget_range || intakeFormEditing.custom_budget || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Timeline</Label>
                    <p className="text-sm text-foreground">{intakeFormEditing.timeline || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge className="mt-1">
                      {intakeFormEditing.status === 'new'
                        ? '🔴 New'
                        : intakeFormEditing.status === 'reviewing'
                          ? '🟡 Reviewing'
                          : intakeFormEditing.status === 'archived'
                            ? '📦 Archived'
                            : '✅ Reviewed'}
                    </Badge>
                  </div>
                </div>

                {/* Service Focus */}
                {intakeFormEditing.service_focus && intakeFormEditing.service_focus.length > 0 && (
                  <>
                    <Separator className="bg-cyan-bright/10" />
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Service Focus
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {intakeFormEditing.service_focus.map((focus, idx) => (
                          <Badge key={idx} variant="outline" className="border-cyan-bright/30">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Internal Notes */}
                <Separator className="bg-cyan-bright/10" />
                <div className="space-y-2">
                  <Label htmlFor="form-notes" className="text-foreground">
                    Internal Notes
                  </Label>
                  <Textarea
                    id="form-notes"
                    value={intakeFormEditNotes}
                    onChange={(e) => setIntakeFormEditNotes(e.target.value)}
                    placeholder="Add internal notes about this form..."
                    className="bg-ocean-surface border-cyan-bright/20 text-foreground min-h-[100px]"
                  />
                </div>

                {/* Status Update Buttons */}
                <Separator className="bg-cyan-bright/10" />
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from('intake_forms')
                          .update({
                            status: 'reviewing',
                            notes: intakeFormEditNotes,
                          })
                          .eq('id', intakeFormEditing.id)

                        if (error) throw error

                        const { data } = await supabase
                          .from('intake_forms')
                          .select('*')
                          .order('created_at', { ascending: false })
                        if (data) setIntakeForms(data as IntakeForm[])

                        toast.success('Status updated to reviewing')
                        setIntakeFormEditDialogOpen(false)
                      } catch (error) {
                        toast.error('Failed to update')
                      }
                    }}
                    className="flex-1 bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 border border-yellow-400/50"
                    variant="outline"
                    disabled={intakeFormEditing.status === 'reviewing'}
                  >
                    🟡 Mark Reviewing
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from('intake_forms')
                          .update({
                            status: 'reviewed',
                            notes: intakeFormEditNotes,
                          })
                          .eq('id', intakeFormEditing.id)

                        if (error) throw error

                        const { data } = await supabase
                          .from('intake_forms')
                          .select('*')
                          .order('created_at', { ascending: false })
                        if (data) setIntakeForms(data as IntakeForm[])

                        toast.success('Status updated to reviewed')
                        setIntakeFormEditDialogOpen(false)
                      } catch (error) {
                        toast.error('Failed to update')
                      }
                    }}
                    className="flex-1 bg-green-400/20 text-green-400 hover:bg-green-400/30 border border-green-400/50"
                    variant="outline"
                    disabled={intakeFormEditing.status === 'reviewed'}
                  >
                    ✅ Mark Reviewed
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIntakeFormEditDialogOpen(false)}
                  className="border-cyan-bright/40"
                >
                  Close
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('intake_forms')
                        .update({ notes: intakeFormEditNotes })
                        .eq('id', intakeFormEditing.id)

                      if (error) throw error

                      const { data } = await supabase
                        .from('intake_forms')
                        .select('*')
                        .order('created_at', { ascending: false })
                      if (data) setIntakeForms(data as IntakeForm[])

                      toast.success('Notes saved')
                      setIntakeFormEditDialogOpen(false)
                    } catch (error) {
                      toast.error('Failed to save notes')
                    }
                  }}
                  className="bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
                >
                  Save Notes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Admin Dialogs - Lead Management */}
        {profile && isStaff(profile.role) && (
          <>
            {/* Archive Lead Dialog */}
            <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
              <DialogContent className="bg-ocean-deep border-cyan-bright/20">
                <DialogHeader>
                  <DialogTitle className="text-cyan-bright">Archive Lead</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for archiving "{leadToArchive?.name || 'this lead'}"
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="archive-category" className="text-foreground">
                      Category
                    </Label>
                    <Select
                      value={archiveCategory}
                      onValueChange={(value) => setArchiveCategory(value as typeof archiveCategory)}
                    >
                      <SelectTrigger
                        id="archive-category"
                        className="bg-ocean-surface border-cyan-bright/20"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-ocean-deep border-cyan-bright/20">
                        <SelectItem value="not-interested">Not Interested</SelectItem>
                        <SelectItem value="no-budget">No Budget</SelectItem>
                        <SelectItem value="bad-fit">Bad Fit</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="duplicate">Duplicate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="archive-reason" className="text-foreground">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="archive-reason"
                      value={archiveReason}
                      onChange={(e) => setArchiveReason(e.target.value)}
                      placeholder="Enter any additional details..."
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setArchiveDialogOpen(false)
                      setLeadToArchive(null)
                      setArchiveReason('')
                      setArchiveCategory('not-interested')
                    }}
                    className="border-cyan-bright/40"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmArchiveLead}
                    className="bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
                  >
                    Archive Lead
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Archived Leads Section */}
            {leads.filter((l) => l.status === 'archived').length > 0 && (
              <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-cyan-bright flex items-center gap-2">
                        <Archive className="h-5 w-5" />
                        Archived Leads
                      </CardTitle>
                      <CardDescription>
                        Previously archived leads - can be restored if needed
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                      {leads.filter((l) => l.status === 'archived').length} archived
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-cyan-bright/10 bg-ocean-deep/70 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyan-bright/10">
                          <TableHead className="text-cyan-soft">Contact</TableHead>
                          <TableHead className="text-cyan-soft">Message</TableHead>
                          <TableHead className="text-cyan-soft">Category</TableHead>
                          <TableHead className="text-cyan-soft">Reason</TableHead>
                          <TableHead className="text-cyan-soft">Archived Date</TableHead>
                          <TableHead className="text-cyan-soft text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads
                          .filter((l) => l.status === 'archived')
                          .slice(0, 10)
                          .map((lead) => (
                            <TableRow
                              key={lead.id}
                              className="border-cyan-bright/10 hover:bg-cyan-bright/5"
                            >
                              <TableCell>
                                <div className="font-semibold text-foreground">
                                  {lead.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.email || 'No email'}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground max-w-xs truncate">
                                {lead.message || 'No message'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {lead.archive_category?.replace('-', ' ') || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-foreground text-sm max-w-xs truncate">
                                {lead.archive_reason || 'No reason provided'}
                              </TableCell>
                              <TableCell className="text-foreground text-sm">
                                {lead.created_at
                                  ? new Date(lead.created_at).toLocaleDateString()
                                  : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-green-400 hover:bg-green-400/10"
                                  title="Unarchive"
                                  onClick={() => unarchiveLead(lead)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Restore
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Tab Content - Support Tickets */}
            {profile &&
              isStaff(profile.role) &&
              adminViewMode === 'admin' &&
              activeAdminTab === 'support-tickets' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      Support Ticket Management
                    </h2>
                    <Button
                      onClick={() => setActiveAdminTab('dashboard')}
                      variant="outline"
                      className="border-cyan-bright/20 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">← Back to Dashboard</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                  </div>

                  <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                    <CardHeader>
                      <CardDescription>View and respond to client support requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tickets.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <HeadphonesIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg font-medium">No support tickets yet</p>
                          <p className="text-sm mt-2">Client support requests will appear here</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                          {tickets.map((ticket) => (
                            <Card
                              key={ticket.id}
                              className="bg-ocean-deep/60 border-cyan-bright/10 cursor-pointer hover:border-cyan-bright/30 transition-all hover:shadow-lg hover:shadow-cyan-bright/5"
                              onClick={() => {
                                setSelectedTicket(ticket)
                                loadTicketResponses(ticket.id)
                              }}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-base font-semibold text-foreground line-clamp-2">
                                    {ticket.title}
                                  </CardTitle>
                                  <Badge
                                    variant={
                                      ticket.status === 'open'
                                        ? 'default'
                                        : ticket.status === 'in_progress'
                                          ? 'secondary'
                                          : 'outline'
                                    }
                                    className="shrink-0"
                                  >
                                    {ticket.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {ticket.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {ticket.category || 'general'}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      ticket.priority === 'urgent'
                                        ? 'border-red-500 text-red-500'
                                        : ticket.priority === 'high'
                                          ? 'border-orange-500 text-orange-500'
                                          : ticket.priority === 'medium'
                                            ? 'border-yellow-500 text-yellow-500'
                                            : 'border-green-500 text-green-500'
                                    }`}
                                  >
                                    {ticket.priority || 'medium'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-cyan-bright/10">
                                  <Clock className="h-3 w-3" />
                                  {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Admin Tab Content - User Management */}
            {profile &&
              isAdmin(profile.role) &&
              adminViewMode === 'admin' &&
              activeAdminTab === 'user-management' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      User & Role Management
                    </h2>
                    <Button
                      onClick={() => setActiveAdminTab('dashboard')}
                      variant="outline"
                      className="border-cyan-bright/20 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">← Back to Dashboard</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                  </div>

                  <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                    <CardHeader>
                      <CardDescription>
                        Manage user accounts and assign roles (Admin, Team Member, Client, User)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            id="userSearch"
                            name="userSearch"
                            type="text"
                            placeholder="Search users by name or ID..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            aria-label="Search users by name or ID"
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-ocean-deep border border-cyan-bright/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-bright/50"
                          />
                        </div>
                        <Badge variant="outline" className="border-cyan-bright/50 text-cyan-bright">
                          {allProfiles.length} total users
                        </Badge>
                      </div>

                      {/* User List */}
                      {allProfiles.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm mt-2">Users will appear here once they sign up</p>
                        </div>
                      ) : (
                        <>
                          <div className="overflow-x-auto rounded-lg border border-cyan-bright/10">
                            <Table className="text-xs">
                              <TableHeader>
                                <TableRow className="border-cyan-bright/10 hover:bg-transparent">
                                  <TableHead className="text-cyan-soft text-xs px-2 py-2">
                                    User
                                  </TableHead>
                                  <TableHead className="text-cyan-soft text-xs px-2 py-2 hidden sm:table-cell">
                                    ID
                                  </TableHead>
                                  <TableHead className="text-cyan-soft text-xs px-2 py-2">
                                    Role
                                  </TableHead>
                                  <TableHead className="text-cyan-soft text-right text-xs px-2 py-2">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {allProfiles
                                  .filter((user) => {
                                    const searchLower = debouncedUserSearchTerm.toLowerCase()
                                    return (
                                      user.name?.toLowerCase().includes(searchLower) ||
                                      user.id.toLowerCase().includes(searchLower) ||
                                      user.role.toLowerCase().includes(searchLower)
                                    )
                                  })
                                  .map((user) => {
                                    const isCurrentUser = user.id === profile?.id
                                    const isUpdating = updatingRole === user.id
                                    const isDeleting = archivingUser === user.id

                                    return (
                                      <TableRow
                                        key={user.id}
                                        className="border-cyan-bright/10 hover:bg-ocean-deep/40"
                                      >
                                        <TableCell className="font-medium text-foreground text-xs px-2 py-2 max-w-[100px] sm:max-w-none">
                                          <div className="truncate">
                                            {user.name || 'Unnamed User'}
                                          </div>
                                          {isCurrentUser && (
                                            <Badge variant="secondary" className="ml-1 text-[8px]">
                                              You
                                            </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs font-mono px-2 py-2 hidden sm:table-cell">
                                          {user.id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell className="px-2 py-2">
                                          <Badge
                                            variant={
                                              user.role === 'admin'
                                                ? 'default'
                                                : user.role === 'team_member'
                                                  ? 'default'
                                                  : user.role === 'client'
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                            className={`capitalize text-[8px] sm:text-xs whitespace-nowrap ${
                                              user.role === 'team_member'
                                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                                                : ''
                                            }`}
                                          >
                                            {user.role === 'team_member' ? 'Team' : user.role}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-2 py-2">
                                          <div className="flex items-center justify-end gap-1">
                                            <select
                                              value={user.role}
                                              onChange={(e) => {
                                                console.log(
                                                  'Dropdown changed! User:',
                                                  user.id,
                                                  'New value:',
                                                  e.target.value,
                                                )
                                                updateUserRole(
                                                  user.id,
                                                  e.target.value as
                                                    | 'admin'
                                                    | 'team_member'
                                                    | 'client'
                                                    | 'user',
                                                )
                                              }}
                                              disabled={
                                                isCurrentUser ||
                                                isUpdating ||
                                                archivingUser === user.id
                                              }
                                              className="px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded border border-cyan-bright/20 bg-ocean-deep text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-cyan-bright/50"
                                            >
                                              <option value="user">User</option>
                                              <option value="client">Client</option>
                                              <option value="team_member">Team</option>
                                              <option value="admin">Admin</option>
                                            </select>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                setUserToArchive(user)
                                                setArchiveUserDialogOpen(true)
                                              }}
                                              disabled={isCurrentUser || isDeleting}
                                              className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/10"
                                              title="Delete user"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                            {isUpdating && (
                                              <span className="text-[9px] text-cyan-bright hidden sm:inline">
                                                Updating...
                                              </span>
                                            )}
                                            {isDeleting && (
                                              <span className="text-[9px] text-red-400 hidden sm:inline">
                                                Deleting...
                                              </span>
                                            )}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}

                      {/* Role Descriptions */}
                      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <div className="p-4 rounded-lg bg-ocean-deep/60 border border-cyan-bright/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default" className="text-xs">
                              Admin
                            </Badge>
                            <span className="text-lg">👨‍💼</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Full platform access. Can manage all data, users, tickets, and send
                            notifications.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-ocean-deep/60 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="default"
                              className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/50"
                            >
                              Team Member
                            </Badge>
                            <span className="text-lg">👔</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Staff access. Can view data, manage tickets, but cannot change user
                            roles or critical settings.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-ocean-deep/60 border border-cyan-bright/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Client
                            </Badge>
                            <span className="text-lg">💼</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Customer accounts. Access to projects, invoices, subscriptions, and
                            support tickets.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-ocean-deep/60 border border-cyan-bright/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              User
                            </Badge>
                            <span className="text-lg">👤</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            General access. Can browse services, submit tickets, and receive
                            notifications.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Ticket Detail Modal */}
            {selectedTicket && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={() => {
                  setSelectedTicket(null)
                  setTicketResponses([])
                  setResponseMessage('')
                }}
              >
                <div
                  className="bg-ocean-surface border border-cyan-bright/20 rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h2 className="text-2xl font-bold text-cyan-bright mb-2">
                          {selectedTicket.title}
                        </h2>
                        <p className="text-muted-foreground">{selectedTicket.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(null)
                          setTicketResponses([])
                          setResponseMessage('')
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        ✕
                      </Button>
                    </div>

                    {/* Ticket Meta */}
                    <div className="flex items-center gap-3 flex-wrap pb-4 border-b border-cyan-bright/10">
                      <Badge variant={selectedTicket.status === 'open' ? 'default' : 'secondary'}>
                        {selectedTicket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedTicket.category || 'general'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          selectedTicket.priority === 'urgent'
                            ? 'border-red-500 text-red-500'
                            : selectedTicket.priority === 'high'
                              ? 'border-orange-500 text-orange-500'
                              : 'border-yellow-500 text-yellow-500'
                        }
                      >
                        {selectedTicket.priority || 'medium'}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedTicket.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Status Controls - Admin Only */}
                    {profile?.role === 'admin' && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                          disabled={selectedTicket.status === 'in_progress'}
                          className="border-cyan-bright/20 hover:bg-cyan-bright/10"
                        >
                          Mark In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                          disabled={selectedTicket.status === 'resolved'}
                          className="border-cyan-bright/20 hover:bg-cyan-bright/10"
                        >
                          Mark Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTicketStatus(selectedTicket.id, 'open')}
                          disabled={selectedTicket.status === 'open'}
                          className="border-cyan-bright/20 hover:bg-cyan-bright/10"
                        >
                          Reopen
                        </Button>
                      </div>
                    )}

                    {/* Conversation Thread */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Conversation
                      </h3>
                      {ticketResponses.length === 0 ? (
                        <div className="text-center py-8 rounded-lg bg-ocean-deep/40 border border-dashed border-cyan-bright/20">
                          <MessageSquare className="h-10 w-10 mx-auto mb-2 text-cyan-bright/40" />
                          <p className="text-sm text-muted-foreground">No responses yet</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Be the first to respond to this ticket
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                          {ticketResponses.map((response) => (
                            <div
                              key={response.id}
                              className="p-4 bg-ocean-deep/60 rounded-lg border border-cyan-bright/10"
                            >
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {response.message}
                              </p>
                              <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {new Date(response.created_at).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Response Form */}
                    <div className="space-y-3 pt-4 border-t border-cyan-bright/10">
                      <h3 className="font-semibold text-foreground">
                        {profile?.role === 'admin' ? 'Add Response' : 'Add Message'}
                      </h3>
                      <textarea
                        id="responseMessage"
                        name="responseMessage"
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder={
                          profile?.role === 'admin'
                            ? 'Type your response to the client...'
                            : 'Add more details or ask a question...'
                        }
                        aria-label={profile?.role === 'admin' ? 'Response to client' : 'Message'}
                        rows={4}
                        className="w-full rounded-md bg-ocean-deep border border-cyan-bright/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-bright/50 resize-none"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={respondToTicket}
                          disabled={sendingResponse || !responseMessage.trim()}
                          className="flex-1 bg-cyan-bright text-ocean-deep hover:bg-cyan-bright/90"
                        >
                          {sendingResponse
                            ? 'Sending...'
                            : profile?.role === 'admin'
                              ? 'Send Response'
                              : 'Send Message'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setResponseMessage('')}
                          disabled={sendingResponse}
                          className="border-cyan-bright/20 hover:bg-cyan-bright/5"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Tab Content - Payment Tracking Dashboard */}
            {profile &&
              isStaff(profile.role) &&
              adminViewMode === 'admin' &&
              activeAdminTab === 'payments' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      Payment Tracking
                    </h2>
                    <Button
                      onClick={() => setActiveAdminTab('dashboard')}
                      variant="outline"
                      className="border-cyan-bright/20 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">← Back to Dashboard</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                  </div>

                  <PaymentTrackingDashboard />
                </div>
              )}

            {/* Admin Tab Content - Calendar & Bookings */}
            {profile &&
              isStaff(profile.role) &&
              adminViewMode === 'admin' &&
              activeAdminTab === 'calendar' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      Calendar & Room Bookings
                    </h2>
                    <Button
                      onClick={() => setActiveAdminTab('dashboard')}
                      variant="outline"
                      className="border-cyan-bright/20 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">← Back to Dashboard</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                  </div>

                  <RoomBookingDashboard />
                </div>
              )}

            {/* Admin Tab Content - Analytics Dashboard */}
            {profile &&
              isStaff(profile.role) &&
              adminViewMode === 'admin' &&
              activeAdminTab === 'analytics' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-bright">
                      Analytics Dashboard
                    </h2>
                    <Button
                      onClick={() => setActiveAdminTab('dashboard')}
                      variant="outline"
                      className="border-cyan-bright/20 text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">← Back to Dashboard</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                  </div>

                  <Card className="bg-ocean-surface/60 border-cyan-bright/10 shadow-xl shadow-cyan-bright/10">
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-cyan-bright/40" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Analytics Coming Soon
                      </h3>
                      <p className="text-muted-foreground">
                        Advanced analytics and reporting features are under development.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Archive User Dialog */}
            <Dialog open={archiveUserDialogOpen} onOpenChange={setArchiveUserDialogOpen}>
              <DialogContent className="bg-ocean-deep border-cyan-bright/20">
                <DialogHeader>
                  <DialogTitle className="text-red-500">Delete User Account</DialogTitle>
                  <DialogDescription>
                    ⚠️ WARNING: This will permanently delete "{userToArchive?.name || 'this user'}"
                    and ALL their associated data (invoices, intake forms, projects, subscriptions).
                    This action CANNOT be undone. The user will need to create a completely new
                    account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400 font-semibold">
                      This is a permanent deletion. All data will be lost.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="archive-user-reason" className="text-foreground">
                      Reason for Deletion (Optional)
                    </Label>
                    <Textarea
                      id="archive-user-reason"
                      value={archiveUserReason}
                      onChange={(e) => setArchiveUserReason(e.target.value)}
                      placeholder="Enter any notes about why this account is being deleted..."
                      className="bg-ocean-surface border-cyan-bright/20 text-foreground min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setArchiveUserDialogOpen(false)
                      setUserToArchive(null)
                      setArchiveUserReason('')
                    }}
                    className="border-cyan-bright/40"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmArchiveUser}
                    disabled={archivingUser !== null}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {archivingUser ? 'Deleting...' : 'Permanently Delete User'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </Layout>
  )
}
