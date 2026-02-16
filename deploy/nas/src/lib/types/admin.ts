// Admin-specific type definitions derived from Supabase schema
import type { Database } from '@/integrations/supabase/types'

// Extract table types for easier use
export type Tables = Database['public']['Tables']

// Individual table row types
export type Lead = Tables['leads']['Row']
export type Client = Tables['clients']['Row']
export type Project = Tables['projects']['Row']
export type Invoice = Tables['invoices']['Row']
export type Subscription = Tables['subscriptions']['Row']
export type Profile = Tables['profiles']['Row']
export type AuditLog = Tables['audit_log']['Row']
export type ApiToken = Tables['api_tokens']['Row']

// Insert types for forms
export type LeadInsert = Tables['leads']['Insert']
export type ClientInsert = Tables['clients']['Insert']
export type ProjectInsert = Tables['projects']['Insert']
export type InvoiceInsert = Tables['invoices']['Insert']
export type SubscriptionInsert = Tables['subscriptions']['Insert']

// Update types for edits
export type LeadUpdate = Tables['leads']['Update']
export type ClientUpdate = Tables['clients']['Update']
export type ProjectUpdate = Tables['projects']['Update']
export type InvoiceUpdate = Tables['invoices']['Update']
export type SubscriptionUpdate = Tables['subscriptions']['Update']

// Extended types with relationships
export interface ClientWithProjects extends Client {
  projects?: Project[]
  subscriptions?: Subscription[]
}

export interface ProjectWithInvoices extends Project {
  invoices?: Invoice[]
  client?: Client
}

export interface InvoiceWithProject extends Invoice {
  project?: Project & { client?: Client }
}

// Admin panel specific types
export interface AdminStats {
  totalClients: number
  activeProjects: number
  monthlyRevenue: number
  pendingInvoices: number
  newLeads: number
  conversionRate: number
}

export interface DashboardData {
  stats: AdminStats
  recentLeads: Lead[]
  activeProjects: Project[]
  upcomingInvoices: Invoice[]
  clientGrowth: Array<{ month: string; clients: number; revenue: number }>
}

// Filter and search types
export interface ClientFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  dateRange?: { from: Date; to: Date }
}

export interface ProjectFilters {
  search?: string
  status?: 'active' | 'completed' | 'on-hold' | 'cancelled'
  clientId?: string
}

export interface InvoiceFilters {
  search?: string
  status?: 'draft' | 'sent' | 'paid' | 'overdue'
  dateRange?: { from: Date; to: Date }
}

// Form schemas for validation
export interface LeadFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message?: string
  source?: string
}

export interface ClientFormData {
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
  notes?: string
}

export interface ProjectFormData {
  client_id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  start_date: string
  end_date?: string
  budget?: number
}

export interface InvoiceFormData {
  project_id: string
  amount: number
  description?: string
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
}
