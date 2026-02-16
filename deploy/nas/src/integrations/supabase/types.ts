export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      api_tokens: {
        Row: {
          created_at: string
          id: number
          last_used_at: string
          name: string
          token_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          last_used_at?: string
          name: string
          token_hash: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          last_used_at?: string
          name?: string
          token_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: number | null
          id: number
          meta: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: number | null
          id?: number
          meta?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: number | null
          id?: number
          meta?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string
          created_at: string
          email: string
          id: number
          message: string
          name: string
          phone: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: number
          message: string
          name: string
          phone: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: number
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      intake_forms: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          business_details: Json | null
          company_name: string | null
          created_at: string
          custom_budget: string | null
          division: string
          email: string
          estimated_cost: number | null
          followed_up_at: string | null
          full_name: string
          id: string
          media_details: Json | null
          notes: string | null
          phone: string | null
          preferred_contact: string | null
          priority_score: number | null
          recommended_tier: string | null
          referral_source: string | null
          service_category: string
          service_focus: string[] | null
          status: string
          tech_details: Json | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          business_details?: Json | null
          company_name?: string | null
          created_at?: string
          custom_budget?: string | null
          division: string
          email: string
          estimated_cost?: number | null
          followed_up_at?: string | null
          full_name: string
          id?: string
          media_details?: Json | null
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          priority_score?: number | null
          recommended_tier?: string | null
          referral_source?: string | null
          service_category: string
          service_focus?: string[] | null
          status?: string
          tech_details?: Json | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          business_details?: Json | null
          company_name?: string | null
          created_at?: string
          custom_budget?: string | null
          division?: string
          email?: string
          estimated_cost?: number | null
          followed_up_at?: string | null
          full_name?: string
          id?: string
          media_details?: Json | null
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          priority_score?: number | null
          recommended_tier?: string | null
          referral_source?: string | null
          service_category?: string
          service_focus?: string[] | null
          status?: string
          tech_details?: Json | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          rate: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity: number
          rate: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: 'invoice_line_items_invoice_id_fkey'
            columns: ['invoice_id']
            referencedRelation: 'invoices'
            referencedColumns: ['id']
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_address: string | null
          client_email: string
          client_name: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          paid_date: string | null
          status: string
          tax_amount: number | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          amount: number
          client_address?: string | null
          client_email: string
          client_name: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          paid_date?: string | null
          status?: string
          tax_amount?: number | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_address?: string | null
          client_email?: string
          client_name?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_date?: string | null
          status?: string
          tax_amount?: number | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: number
          message: string
          name: string
          source: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: number
          message: string
          name: string
          source?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: number
          message?: string
          name?: string
          source?: string | null
          status?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          ip_address: string
          is_active: boolean
          source: string
          subscribed_at: string
          unsubscribed_at: string
          user_agent: string
        }
        Insert: {
          email: string
          id?: string
          ip_address: string
          is_active?: boolean
          source: string
          subscribed_at?: string
          unsubscribed_at: string
          user_agent: string
        }
        Update: {
          email?: string
          id?: string
          ip_address?: string
          is_active?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string
          user_agent?: string
        }
        Relationships: []
      }
      room_bookings: {
        Row: {
          id: string
          room_id: number
          room: string
          date: string
          time: string
          capacity: number
          floor: string
          title: string
          booked_by: string | null
          booked_by_name: string
          booked_at: string
          attendees: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: number
          room: string
          date: string
          time: string
          capacity: number
          floor: string
          title: string
          booked_by?: string | null
          booked_by_name: string
          booked_at?: string
          attendees?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: number
          room?: string
          date?: string
          time?: string
          capacity?: number
          floor?: string
          title?: string
          booked_by?: string | null
          booked_by_name?: string
          booked_at?: string
          attendees?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_appointments: {
        Row: {
          id: string
          date: string
          time: string
          client_name: string
          client_email: string
          purpose: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          time: string
          client_name: string
          client_email: string
          purpose: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          time?: string
          client_name?: string
          client_email?: string
          purpose?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          message: string
          recipients: string[]
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          message: string
          recipients?: string[]
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          message?: string
          recipients?: string[]
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          role: 'admin' | 'team_member' | 'client' | 'user'
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role?: 'admin' | 'team_member' | 'client' | 'user'
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: 'admin' | 'team_member' | 'client' | 'user'
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          monthly_fee: string | null
          name: string
          notes: string | null
          status: string
          total_budget: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          monthly_fee?: string | null
          name: string
          notes?: string | null
          status: string
          total_budget?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          monthly_fee?: string | null
          name?: string
          notes?: string | null
          status?: string
          total_budget?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string
          current_period_end: string
          id: number
          plan: string
          price: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end: string
          id?: number
          plan: string
          price?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string
          id?: number
          plan?: string
          price?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description: string
          status?: string
          priority?: string | null
          category?: string | null
          created_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          priority?: string | null
          category?: string | null
          created_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          closed_at?: string | null
        }
        Relationships: []
      }
      ticket_responses: {
        Row: {
          id: string
          ticket_id: string
          message: string
          created_by: string | null
          is_internal_note: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          message: string
          created_by?: string | null
          is_internal_note?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          message?: string
          created_by?: string | null
          is_internal_note?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
