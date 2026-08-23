export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          category: Database["public"]["Enums"]["activity_category"]
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          module: string
          new_values: Json | null
          old_values: Json | null
          severity: Database["public"]["Enums"]["activity_severity"]
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          category: Database["public"]["Enums"]["activity_category"]
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module: string
          new_values?: Json | null
          old_values?: Json | null
          severity?: Database["public"]["Enums"]["activity_severity"]
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          category?: Database["public"]["Enums"]["activity_category"]
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string
          new_values?: Json | null
          old_values?: Json | null
          severity?: Database["public"]["Enums"]["activity_severity"]
          user_agent?: string | null
        }
        Relationships: []
      }
      article_authors: {
        Row: {
          article_id: string
          created_at: string
          created_by: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["article_role"]
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          article_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["article_role"]
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["article_role"]
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_audit_logs: {
        Row: {
          completed_at: string | null
          error: string | null
          event_name: string
          execution_time_ms: number | null
          handler: string
          id: string
          metadata: Json | null
          started_at: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          event_name: string
          execution_time_ms?: number | null
          handler: string
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          event_name?: string
          execution_time_ms?: number | null
          handler?: string
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      background_jobs: {
        Row: {
          attempt: number
          created_at: string
          id: string
          job_type: string
          last_error: string | null
          max_attempts: number
          next_retry_at: string | null
          payload: Json
          status: string
          updated_at: string
        }
        Insert: {
          attempt?: number
          created_at?: string
          id?: string
          job_type: string
          last_error?: string | null
          max_attempts?: number
          next_retry_at?: string | null
          payload?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          attempt?: number
          created_at?: string
          id?: string
          job_type?: string
          last_error?: string | null
          max_attempts?: number
          next_retry_at?: string | null
          payload?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_documents: {
        Row: {
          contact_id: string
          created_at: string
          document_category: string
          id: string
          media_id: string
          title: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          document_category: string
          id?: string
          media_id: string
          title: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          document_category?: string
          id?: string
          media_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contact_documents_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_interactions: {
        Row: {
          contact_id: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          interaction_date: string
          interaction_type: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          interaction_date?: string
          interaction_type: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          interaction_date?: string
          interaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contact_interactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_merge_history: {
        Row: {
          created_at: string
          id: string
          merge_data: Json
          merged_by: string
          merged_contact_id: string
          primary_contact_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          merge_data: Json
          merged_by: string
          merged_contact_id: string
          primary_contact_id: string
        }
        Update: {
          created_at?: string
          id?: string
          merge_data?: Json
          merged_by?: string
          merged_contact_id?: string
          primary_contact_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_merge_history_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_merge_history_merged_contact_id_fkey"
            columns: ["merged_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_merge_history_merged_contact_id_fkey"
            columns: ["merged_contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contact_merge_history_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_merge_history_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      contact_notes: {
        Row: {
          author_id: string
          contact_id: string
          created_at: string
          id: string
          is_deleted: boolean
          note_text: string
          updated_at: string
        }
        Insert: {
          author_id: string
          contact_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          note_text: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          contact_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          note_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      contact_relationships: {
        Row: {
          contact_id: string
          contact_type_id: string
          created_at: string
          created_by: string | null
          ended_at: string | null
          id: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          contact_id: string
          contact_type_id: string
          created_at?: string
          created_by?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          contact_id?: string
          contact_type_id?: string
          created_at?: string
          created_by?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_relationships_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_relationships_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contact_relationships_contact_type_id_fkey"
            columns: ["contact_type_id"]
            isOneToOne: false
            referencedRelation: "contact_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_relationships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tag_assignments: {
        Row: {
          contact_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_tag_assignments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_tag_assignments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contact_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_types: {
        Row: {
          color: string | null
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          alternate_phone: string | null
          city: string | null
          contact_number: string
          country: string | null
          created_at: string
          created_by: string | null
          designation: string | null
          district: string | null
          email: string | null
          full_name: string
          id: string
          is_deleted: boolean
          notes: string | null
          organization_id: string | null
          phone: string | null
          photo_media_id: string | null
          preferred_contact_method: string | null
          preferred_language: string | null
          profile_id: string | null
          search_vector: unknown
          social_links: Json | null
          state: string | null
          status: string
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          alternate_phone?: string | null
          city?: string | null
          contact_number: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          designation?: string | null
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          photo_media_id?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          profile_id?: string | null
          search_vector?: unknown
          social_links?: Json | null
          state?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          alternate_phone?: string | null
          city?: string | null
          contact_number?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          designation?: string | null
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          photo_media_id?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          profile_id?: string | null
          search_vector?: unknown
          social_links?: Json | null
          state?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          category: Database["public"]["Enums"]["kpi_category"]
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean
          layout: Json | null
          permissions: string[] | null
          refresh_interval_seconds: number | null
          updated_at: string
          widget_name: string
          widget_type: string
        }
        Insert: {
          category: Database["public"]["Enums"]["kpi_category"]
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          layout?: Json | null
          permissions?: string[] | null
          refresh_interval_seconds?: number | null
          updated_at?: string
          widget_name: string
          widget_type: string
        }
        Update: {
          category?: Database["public"]["Enums"]["kpi_category"]
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          layout?: Json | null
          permissions?: string[] | null
          refresh_interval_seconds?: number | null
          updated_at?: string
          widget_name?: string
          widget_type?: string
        }
        Relationships: []
      }
      donation_campaigns: {
        Row: {
          campaign_code: string
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          end_date: string | null
          gallery_id: string | null
          goal_amount: number
          id: string
          is_deleted: boolean
          is_featured: boolean
          metadata: Json | null
          priority: number
          program_id: string | null
          raised_amount: number
          search_vector: unknown
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["program_visibility"]
        }
        Insert: {
          campaign_code: string
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          gallery_id?: string | null
          goal_amount?: number
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          metadata?: Json | null
          priority?: number
          program_id?: string | null
          raised_amount?: number
          search_vector?: unknown
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Update: {
          campaign_code?: string
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          gallery_id?: string | null
          goal_amount?: number
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          metadata?: Json | null
          priority?: number
          program_id?: string | null
          raised_amount?: number
          search_vector?: unknown
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "donation_campaigns_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "donation_campaigns_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_refunds: {
        Row: {
          created_at: string
          donation_id: string
          gateway_refund_id: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string
          refund_amount: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          donation_id: string
          gateway_refund_id?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          refund_amount: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          donation_id?: string
          gateway_refund_id?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          refund_amount?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_refunds_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          contact_id: string
          created_at: string
          created_by: string | null
          currency: string
          deleted_at: string | null
          deleted_by: string | null
          donation_number: string
          donation_type: Database["public"]["Enums"]["donation_type"]
          event_id: string | null
          gateway_order_id: string | null
          gateway_transaction_id: string | null
          id: string
          is_80g_eligible: boolean
          is_deleted: boolean
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          program_id: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          purpose: string | null
          receipt_generated: boolean
          recurring_donation_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          contact_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          deleted_by?: string | null
          donation_number: string
          donation_type?: Database["public"]["Enums"]["donation_type"]
          event_id?: string | null
          gateway_order_id?: string | null
          gateway_transaction_id?: string | null
          id?: string
          is_80g_eligible?: boolean
          is_deleted?: boolean
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          program_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          purpose?: string | null
          receipt_generated?: boolean
          recurring_donation_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          contact_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          deleted_by?: string | null
          donation_number?: string
          donation_type?: Database["public"]["Enums"]["donation_type"]
          event_id?: string | null
          gateway_order_id?: string | null
          gateway_transaction_id?: string | null
          id?: string
          is_80g_eligible?: boolean
          is_deleted?: boolean
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          program_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          purpose?: string | null
          receipt_generated?: boolean
          recurring_donation_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "vw_campaign_progress"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "donations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "donations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_recurring_donation_id_fkey"
            columns: ["recurring_donation_id"]
            isOneToOne: false
            referencedRelation: "recurring_donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_donations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_donations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          provider: string
          provider_message_id: string | null
          recipient: string
          retry_count: number
          sent_at: string | null
          status: string
          template: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          provider?: string
          provider_message_id?: string | null
          recipient: string
          retry_count?: number
          sent_at?: string | null
          status?: string
          template: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          provider?: string
          provider_message_id?: string | null
          recipient?: string
          retry_count?: number
          sent_at?: string | null
          status?: string
          template?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          assignment_time: string | null
          category: Database["public"]["Enums"]["enquiry_category"]
          channel: string | null
          contact_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          department: Database["public"]["Enums"]["enquiry_department"]
          enquiry_number: string
          escalation_level: number
          expected_resolution: string | null
          first_response_time: string | null
          id: string
          ip_address: string | null
          is_deleted: boolean
          message: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["enquiry_priority"]
          resolved_at: string | null
          resolved_by: string | null
          search_vector: unknown
          source: Database["public"]["Enums"]["enquiry_source"]
          status: Database["public"]["Enums"]["enquiry_status"]
          subject: string
          updated_at: string
          updated_by: string | null
          user_agent: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          assignment_time?: string | null
          category?: Database["public"]["Enums"]["enquiry_category"]
          channel?: string | null
          contact_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department?: Database["public"]["Enums"]["enquiry_department"]
          enquiry_number: string
          escalation_level?: number
          expected_resolution?: string | null
          first_response_time?: string | null
          id?: string
          ip_address?: string | null
          is_deleted?: boolean
          message: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["enquiry_priority"]
          resolved_at?: string | null
          resolved_by?: string | null
          search_vector?: unknown
          source?: Database["public"]["Enums"]["enquiry_source"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject: string
          updated_at?: string
          updated_by?: string | null
          user_agent?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          assignment_time?: string | null
          category?: Database["public"]["Enums"]["enquiry_category"]
          channel?: string | null
          contact_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department?: Database["public"]["Enums"]["enquiry_department"]
          enquiry_number?: string
          escalation_level?: number
          expected_resolution?: string | null
          first_response_time?: string | null
          id?: string
          ip_address?: string | null
          is_deleted?: boolean
          message?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["enquiry_priority"]
          resolved_at?: string | null
          resolved_by?: string | null
          search_vector?: unknown
          source?: Database["public"]["Enums"]["enquiry_source"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string
          updated_at?: string
          updated_by?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiries_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "enquiries_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_attachments: {
        Row: {
          created_at: string
          enquiry_id: string
          file_size: number | null
          id: string
          media_file_id: string
          mime_type: string | null
          original_name: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          enquiry_id: string
          file_size?: number | null
          id?: string
          media_file_id: string
          mime_type?: string | null
          original_name: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          enquiry_id?: string
          file_size?: number | null
          id?: string
          media_file_id?: string
          mime_type?: string | null
          original_name?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_attachments_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_attachments_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "vw_open_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_attachments_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_messages: {
        Row: {
          author_id: string | null
          created_at: string
          enquiry_id: string
          id: string
          message: string
          updated_at: string
          visibility: Database["public"]["Enums"]["message_visibility"]
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          enquiry_id: string
          id?: string
          message: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["message_visibility"]
        }
        Update: {
          author_id?: string | null
          created_at?: string
          enquiry_id?: string
          id?: string
          message?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["message_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_messages_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquiry_messages_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "vw_open_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_media: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean
          media_id: string
          purpose: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean
          media_id: string
          purpose?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean
          media_id?: string
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_taxonomies: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean
          relationship_type: string | null
          sort_order: number
          term_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean
          relationship_type?: string | null
          sort_order?: number
          term_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean
          relationship_type?: string | null
          sort_order?: number
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_taxonomies_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          check_in_timestamp: string
          check_out_timestamp: string | null
          created_at: string
          id: string
          metadata: Json | null
          registration_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          check_in_timestamp?: string
          check_out_timestamp?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          registration_id: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          check_in_timestamp?: string
          check_out_timestamp?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          registration_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_certificates: {
        Row: {
          certificate_number: string
          created_at: string
          id: string
          issue_date: string
          issued_by: string | null
          media_file_id: string | null
          registration_id: string
          template_name: string
          updated_at: string
          verification_code: string
        }
        Insert: {
          certificate_number: string
          created_at?: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          media_file_id?: string | null
          registration_id: string
          template_name: string
          updated_at?: string
          verification_code: string
        }
        Update: {
          certificate_number?: string
          created_at?: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          media_file_id?: string | null
          registration_id?: string
          template_name?: string
          updated_at?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_certificates_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_certificates_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_certificates_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_members: {
        Row: {
          created_at: string
          created_by: string | null
          custom_title: string | null
          event_id: string
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["event_role"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          custom_title?: string | null
          event_id: string
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["event_role"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          custom_title?: string | null
          event_id?: string
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["event_role"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          certificate_eligible: boolean
          created_at: string
          created_by: string | null
          event_id: string
          id: string
          metadata: Json | null
          profile_id: string
          registration_timestamp: string
          role: Database["public"]["Enums"]["registration_role"]
          status: Database["public"]["Enums"]["registration_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          certificate_eligible?: boolean
          created_at?: string
          created_by?: string | null
          event_id: string
          id?: string
          metadata?: Json | null
          profile_id: string
          registration_timestamp?: string
          role?: Database["public"]["Enums"]["registration_role"]
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          certificate_eligible?: boolean
          created_at?: string
          created_by?: string | null
          event_id?: string
          id?: string
          metadata?: Json | null
          profile_id?: string
          registration_timestamp?: string
          role?: Database["public"]["Enums"]["registration_role"]
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_volunteers: {
        Row: {
          assigned_by: string | null
          attendance_status: string
          check_in_timestamp: string | null
          check_out_timestamp: string | null
          created_at: string
          created_by: string | null
          event_id: string
          feedback_notes: string | null
          hours_logged: number | null
          id: string
          performance_rating: number | null
          role: string
          updated_at: string
          updated_by: string | null
          volunteer_id: string
        }
        Insert: {
          assigned_by?: string | null
          attendance_status?: string
          check_in_timestamp?: string | null
          check_out_timestamp?: string | null
          created_at?: string
          created_by?: string | null
          event_id: string
          feedback_notes?: string | null
          hours_logged?: number | null
          id?: string
          performance_rating?: number | null
          role?: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id: string
        }
        Update: {
          assigned_by?: string | null
          attendance_status?: string
          check_in_timestamp?: string | null
          check_out_timestamp?: string | null
          created_at?: string
          created_by?: string | null
          event_id?: string
          feedback_notes?: string | null
          hours_logged?: number | null
          id?: string
          performance_rating?: number | null
          role?: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_volunteers_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "event_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          allow_waitlist: boolean
          banner_image_id: string | null
          city: string | null
          country: string | null
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          end_datetime: string
          event_code: string
          event_type: Database["public"]["Enums"]["event_type"]
          gallery_id: string | null
          id: string
          is_deleted: boolean
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          maximum_age: number | null
          metadata: Json | null
          minimum_age: number | null
          mode: Database["public"]["Enums"]["event_mode"]
          objectives: Json | null
          primary_taxonomy_id: string | null
          program_id: string | null
          registration_close: string | null
          registration_limit: number | null
          registration_open: string | null
          requires_approval: boolean
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          short_title: string | null
          slug: string
          sort_order: number
          start_datetime: string
          state: string | null
          status: Database["public"]["Enums"]["event_status"]
          timezone: string | null
          title: string
          updated_at: string
          updated_by: string | null
          venue: string | null
          visibility: Database["public"]["Enums"]["program_visibility"]
        }
        Insert: {
          address?: string | null
          allow_waitlist?: boolean
          banner_image_id?: string | null
          city?: string | null
          country?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_datetime: string
          event_code: string
          event_type?: Database["public"]["Enums"]["event_type"]
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          maximum_age?: number | null
          metadata?: Json | null
          minimum_age?: number | null
          mode?: Database["public"]["Enums"]["event_mode"]
          objectives?: Json | null
          primary_taxonomy_id?: string | null
          program_id?: string | null
          registration_close?: string | null
          registration_limit?: number | null
          registration_open?: string | null
          requires_approval?: boolean
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_title?: string | null
          slug: string
          sort_order?: number
          start_datetime: string
          state?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          venue?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Update: {
          address?: string | null
          allow_waitlist?: boolean
          banner_image_id?: string | null
          city?: string | null
          country?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_datetime?: string
          event_code?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          maximum_age?: number | null
          metadata?: Json | null
          minimum_age?: number | null
          mode?: Database["public"]["Enums"]["event_mode"]
          objectives?: Json | null
          primary_taxonomy_id?: string | null
          program_id?: string | null
          registration_close?: string | null
          registration_limit?: number | null
          registration_open?: string | null
          requires_approval?: boolean
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_title?: string | null
          slug?: string
          sort_order?: number
          start_datetime?: string
          state?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          venue?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "events_banner_image_id_fkey"
            columns: ["banner_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_primary_taxonomy_id_fkey"
            columns: ["primary_taxonomy_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_articles: {
        Row: {
          article_id: string
          collection: Database["public"]["Enums"]["featured_collection_type"]
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          priority: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          article_id: string
          collection?: Database["public"]["Enums"]["featured_collection_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          article_id?: string
          collection?: Database["public"]["Enums"]["featured_collection_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_galleries: {
        Row: {
          album_id: string
          collection: Database["public"]["Enums"]["featured_gallery_type"]
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          priority: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          album_id: string
          collection?: Database["public"]["Enums"]["featured_gallery_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          album_id?: string
          collection?: Database["public"]["Enums"]["featured_gallery_type"]
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_galleries_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_ledger: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donation_id: string
          event_type: string
          gateway_reference: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donation_id: string
          event_type: string
          gateway_reference?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donation_id?: string
          event_type?: string
          gateway_reference?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_ledger_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_albums: {
        Row: {
          album_code: string
          album_type: Database["public"]["Enums"]["album_type"]
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          display_order: number
          event_id: string | null
          id: string
          is_deleted: boolean
          is_featured: boolean
          metadata: Json | null
          news_id: string | null
          primary_taxonomy_id: string | null
          program_id: string | null
          published_at: string | null
          search_vector: unknown
          slug: string
          status: Database["public"]["Enums"]["album_status"]
          subtitle: string | null
          thumbnail_id: string | null
          title: string
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["album_visibility"]
          volunteer_id: string | null
        }
        Insert: {
          album_code: string
          album_type?: Database["public"]["Enums"]["album_type"]
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_order?: number
          event_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          metadata?: Json | null
          news_id?: string | null
          primary_taxonomy_id?: string | null
          program_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          slug: string
          status?: Database["public"]["Enums"]["album_status"]
          subtitle?: string | null
          thumbnail_id?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["album_visibility"]
          volunteer_id?: string | null
        }
        Update: {
          album_code?: string
          album_type?: Database["public"]["Enums"]["album_type"]
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_order?: number
          event_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          metadata?: Json | null
          news_id?: string | null
          primary_taxonomy_id?: string | null
          program_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          status?: Database["public"]["Enums"]["album_status"]
          subtitle?: string | null
          thumbnail_id?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["album_visibility"]
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "gallery_albums_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_primary_taxonomy_id_fkey"
            columns: ["primary_taxonomy_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "gallery_albums_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_thumbnail_id_fkey"
            columns: ["thumbnail_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "gallery_albums_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          album_id: string
          caption: string | null
          captured_at: string | null
          created_at: string
          created_by: string | null
          credits: string | null
          description: string | null
          display_order: number
          id: string
          is_featured: boolean
          location: string | null
          media_file_id: string
          metadata: Json | null
          photographer: string | null
          search_vector: unknown
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          album_id: string
          caption?: string | null
          captured_at?: string | null
          created_at?: string
          created_by?: string | null
          credits?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          location?: string | null
          media_file_id: string
          metadata?: Json | null
          photographer?: string | null
          search_vector?: unknown
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          album_id?: string
          caption?: string | null
          captured_at?: string | null
          created_at?: string
          created_by?: string | null
          credits?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          location?: string | null
          media_file_id?: string
          metadata?: Json | null
          photographer?: string | null
          search_vector?: unknown
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_relationships: {
        Row: {
          child_album_id: string
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          parent_album_id: string
          relationship_type: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          child_album_id: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          parent_album_id: string
          relationship_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          child_album_id?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          parent_album_id?: string
          relationship_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_relationships_child_album_id_fkey"
            columns: ["child_album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_relationships_parent_album_id_fkey"
            columns: ["parent_album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      index_initiative_gallery: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          initiative_id: string
          media_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          initiative_id: string
          media_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          initiative_id?: string
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "index_initiative_gallery_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "index_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "index_initiative_gallery_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      index_initiatives: {
        Row: {
          beneficiaries: string | null
          chief_guest: string | null
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          duration: string | null
          event_date: string | null
          featured: boolean
          id: string
          initiative_type: string
          is_deleted: boolean
          location: string | null
          outcome: string | null
          partner_name: string | null
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          short_summary: string
          slug: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
          volunteers: string | null
          year: number
        }
        Insert: {
          beneficiaries?: string | null
          chief_guest?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          duration?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          initiative_type: string
          is_deleted?: boolean
          location?: string | null
          outcome?: string | null
          partner_name?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_summary: string
          slug: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
          volunteers?: string | null
          year: number
        }
        Update: {
          beneficiaries?: string | null
          chief_guest?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          duration?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          initiative_type?: string
          is_deleted?: boolean
          location?: string | null
          outcome?: string | null
          partner_name?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_summary?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          volunteers?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "index_initiatives_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_metrics: {
        Row: {
          calculation_date: string
          category: Database["public"]["Enums"]["kpi_category"]
          created_at: string
          growth_percentage: number
          id: string
          metric_name: string
          previous_value: number
          trend: Database["public"]["Enums"]["kpi_trend"]
          value: number
          visibility: string[] | null
        }
        Insert: {
          calculation_date?: string
          category: Database["public"]["Enums"]["kpi_category"]
          created_at?: string
          growth_percentage?: number
          id?: string
          metric_name: string
          previous_value?: number
          trend?: Database["public"]["Enums"]["kpi_trend"]
          value?: number
          visibility?: string[] | null
        }
        Update: {
          calculation_date?: string
          category?: Database["public"]["Enums"]["kpi_category"]
          created_at?: string
          growth_percentage?: number
          id?: string
          metric_name?: string
          previous_value?: number
          trend?: Database["public"]["Enums"]["kpi_trend"]
          value?: number
          visibility?: string[] | null
        }
        Relationships: []
      }
      linked_records: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          module_name: string
          record_id: string
          record_type: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          module_name: string
          record_id: string
          record_type: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          module_name?: string
          record_id?: string
          record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "linked_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "linked_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      media_collection_items: {
        Row: {
          collection_id: string
          created_at: string
          created_by: string | null
          is_primary: boolean
          media_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          created_at?: string
          created_by?: string | null
          is_primary?: boolean
          media_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          created_at?: string
          created_by?: string | null
          is_primary?: boolean
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_collection_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      media_collections: {
        Row: {
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          is_deleted: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["media_visibility"]
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["media_visibility"]
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["media_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "media_collections_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_collections_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          alt_text: string | null
          bucket_name: string
          caption: string | null
          cdn_url: string | null
          checksum: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          duration: number | null
          extension: string | null
          file_size: number
          folder_path: string | null
          height: number | null
          id: string
          is_deleted: boolean
          metadata: Json | null
          mime_type: string
          original_filename: string
          preview_url: string | null
          r2_object_key: string
          search_vector: unknown
          status: Database["public"]["Enums"]["media_status"]
          stored_filename: string
          tags: Json | null
          thumbnail_url: string | null
          type: Database["public"]["Enums"]["media_type"]
          updated_at: string
          updated_by: string | null
          uploader_id: string | null
          version: number
          visibility: Database["public"]["Enums"]["media_visibility"]
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket_name: string
          caption?: string | null
          cdn_url?: string | null
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration?: number | null
          extension?: string | null
          file_size: number
          folder_path?: string | null
          height?: number | null
          id?: string
          is_deleted?: boolean
          metadata?: Json | null
          mime_type: string
          original_filename: string
          preview_url?: string | null
          r2_object_key: string
          search_vector?: unknown
          status?: Database["public"]["Enums"]["media_status"]
          stored_filename: string
          tags?: Json | null
          thumbnail_url?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          updated_at?: string
          updated_by?: string | null
          uploader_id?: string | null
          version?: number
          visibility?: Database["public"]["Enums"]["media_visibility"]
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket_name?: string
          caption?: string | null
          cdn_url?: string | null
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration?: number | null
          extension?: string | null
          file_size?: number
          folder_path?: string | null
          height?: number | null
          id?: string
          is_deleted?: boolean
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          preview_url?: string | null
          r2_object_key?: string
          search_vector?: unknown
          status?: Database["public"]["Enums"]["media_status"]
          stored_filename?: string
          tags?: Json | null
          thumbnail_url?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          updated_at?: string
          updated_by?: string | null
          uploader_id?: string | null
          version?: number
          visibility?: Database["public"]["Enums"]["media_visibility"]
          width?: number | null
        }
        Relationships: []
      }

      site_links: {
        Row: {
          id: string
          slug: string
          label: string
          url: string
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          slug: string
          label: string
          url: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          slug?: string
          label?: string
          url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          website_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          website_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          allow_comments: boolean
          article_code: string
          article_type: Database["public"]["Enums"]["article_type"]
          author_id: string | null
          banner_image_id: string | null
          canonical_url: string | null
          content: string
          content_html: string | null
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          editor_id: string | null
          event_id: string | null
          excerpt: string | null
          expires_at: string | null
          gallery_id: string | null
          id: string
          is_deleted: boolean
          is_featured: boolean
          is_pinned: boolean
          metadata: Json | null
          open_graph_image_id: string | null
          program_id: string | null
          published_at: string | null
          reading_time: number | null
          reviewer_id: string | null
          scheduled_at: string | null
          search_vector: unknown
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          subtitle: string | null
          title: string
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["program_visibility"]
        }
        Insert: {
          allow_comments?: boolean
          article_code: string
          article_type?: Database["public"]["Enums"]["article_type"]
          author_id?: string | null
          banner_image_id?: string | null
          canonical_url?: string | null
          content: string
          content_html?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          editor_id?: string | null
          event_id?: string | null
          excerpt?: string | null
          expires_at?: string | null
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          is_pinned?: boolean
          metadata?: Json | null
          open_graph_image_id?: string | null
          program_id?: string | null
          published_at?: string | null
          reading_time?: number | null
          reviewer_id?: string | null
          scheduled_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Update: {
          allow_comments?: boolean
          article_code?: string
          article_type?: Database["public"]["Enums"]["article_type"]
          author_id?: string | null
          banner_image_id?: string | null
          canonical_url?: string | null
          content?: string
          content_html?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          editor_id?: string | null
          event_id?: string | null
          excerpt?: string | null
          expires_at?: string | null
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          is_pinned?: boolean
          metadata?: Json | null
          open_graph_image_id?: string | null
          program_id?: string | null
          published_at?: string | null
          reading_time?: number | null
          reviewer_id?: string | null
          scheduled_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_banner_image_id_fkey"
            columns: ["banner_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "mvw_event_participation"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "news_articles_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_open_graph_image_id_fkey"
            columns: ["open_graph_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "news_articles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_broadcasts: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          created_by: string | null
          custom_action_url: string | null
          custom_message: string | null
          custom_title: string | null
          failed_deliveries: number | null
          id: string
          priority: Database["public"]["Enums"]["notification_priority"]
          scheduled_for: string | null
          status: string
          successful_deliveries: number | null
          target_all_users: boolean
          target_roles: string[] | null
          target_taxonomies: string[] | null
          target_users: string[] | null
          template_id: string | null
          total_recipients: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          created_by?: string | null
          custom_action_url?: string | null
          custom_message?: string | null
          custom_title?: string | null
          failed_deliveries?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_for?: string | null
          status?: string
          successful_deliveries?: number | null
          target_all_users?: boolean
          target_roles?: string[] | null
          target_taxonomies?: string[] | null
          target_users?: string[] | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          created_by?: string | null
          custom_action_url?: string | null
          custom_message?: string | null
          custom_title?: string | null
          failed_deliveries?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          scheduled_for?: string | null
          status?: string
          successful_deliveries?: number | null
          target_all_users?: boolean
          target_roles?: string[] | null
          target_taxonomies?: string[] | null
          target_users?: string[] | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_broadcasts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          announcements_enabled: boolean
          digest_frequency: string
          email_enabled: boolean
          in_app_enabled: boolean
          marketing_enabled: boolean
          push_enabled: boolean
          realtime_enabled: boolean
          sms_enabled: boolean
          social_enabled: boolean
          updated_at: string
          user_id: string
          webhook_enabled: boolean
        }
        Insert: {
          announcements_enabled?: boolean
          digest_frequency?: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          marketing_enabled?: boolean
          push_enabled?: boolean
          realtime_enabled?: boolean
          sms_enabled?: boolean
          social_enabled?: boolean
          updated_at?: string
          user_id: string
          webhook_enabled?: boolean
        }
        Update: {
          announcements_enabled?: boolean
          digest_frequency?: string
          email_enabled?: boolean
          in_app_enabled?: boolean
          marketing_enabled?: boolean
          push_enabled?: boolean
          realtime_enabled?: boolean
          sms_enabled?: boolean
          social_enabled?: boolean
          updated_at?: string
          user_id?: string
          webhook_enabled?: boolean
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          html_body: string | null
          id: string
          is_active: boolean
          language: string
          subject: string | null
          template_code: string
          updated_at: string
          updated_by: string | null
          variables: Json | null
          version: number
        }
        Insert: {
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name: string
          html_body?: string | null
          id?: string
          is_active?: boolean
          language?: string
          subject?: string | null
          template_code: string
          updated_at?: string
          updated_by?: string | null
          variables?: Json | null
          version?: number
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name?: string
          html_body?: string | null
          id?: string
          is_active?: boolean
          language?: string
          subject?: string | null
          template_code?: string
          updated_at?: string
          updated_by?: string | null
          variables?: Json | null
          version?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: Database["public"]["Enums"]["notification_category"]
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          delivered_at: string | null
          entity_id: string | null
          entity_type: string | null
          expires_at: string | null
          icon: string | null
          id: string
          is_deleted: boolean
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          recipient_id: string
          scheduled_at: string | null
          sender_id: string | null
          sent_at: string | null
          severity: string | null
          source_module: string | null
          status: Database["public"]["Enums"]["notification_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_url?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_deleted?: boolean
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          recipient_id: string
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          severity?: string | null
          source_module?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_url?: string | null
          category?: Database["public"]["Enums"]["notification_category"]
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_deleted?: boolean
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          recipient_id?: string
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          severity?: string | null
          source_module?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          country: string | null
          created_at: string
          district: string | null
          email: string | null
          id: string
          is_deleted: boolean
          logo_media_id: string | null
          name: string
          org_number: string
          organization_type: string | null
          parent_organization_id: string | null
          phone: string | null
          search_vector: unknown
          state: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          id?: string
          is_deleted?: boolean
          logo_media_id?: string | null
          name: string
          org_number?: string
          organization_type?: string | null
          parent_organization_id?: string | null
          phone?: string | null
          search_vector?: unknown
          state?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          id?: string
          is_deleted?: boolean
          logo_media_id?: string | null
          name?: string
          org_number?: string
          organization_type?: string | null
          parent_organization_id?: string | null
          phone?: string | null
          search_vector?: unknown
          state?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_parent_organization_id_fkey"
            columns: ["parent_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks: {
        Row: {
          created_at: string
          event_type: string
          gateway_event_id: string
          headers: Json
          id: string
          is_processed: boolean
          is_verified: boolean
          payload: Json
          processed_at: string | null
          processing_response: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          retry_count: number
          signature: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          gateway_event_id: string
          headers: Json
          id?: string
          is_processed?: boolean
          is_verified?: boolean
          payload: Json
          processed_at?: string | null
          processing_response?: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          retry_count?: number
          signature?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          gateway_event_id?: string
          headers?: Json
          id?: string
          is_processed?: boolean
          is_verified?: boolean
          payload?: Json
          processed_at?: string | null
          processing_response?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          retry_count?: number
          signature?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          id: string
          is_system_permission: boolean
          module: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_system_permission?: boolean
          module: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_system_permission?: boolean
          module?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about: string | null
          alternate_email: string | null
          alternate_phone: string | null
          cover_photo_url: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          deleted_at: string | null
          deleted_by: string | null
          display_name: string | null
          first_name: string
          gender: string | null
          id: string
          is_deleted: boolean
          language: string | null
          last_name: string | null
          location: string | null
          metadata: Json | null
          middle_name: string | null
          phone: string | null
          preferred_name: string | null
          primary_email: string | null
          profile_completeness: number
          profile_photo_url: string | null
          search_vector: unknown
          short_bio: string | null
          slug: string
          social_links: Json | null
          status: string
          timezone: string | null
          updated_at: string
          updated_by: string | null
          verification_status: string
          visibility: string
          website: string | null
        }
        Insert: {
          about?: string | null
          alternate_email?: string | null
          alternate_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string | null
          first_name: string
          gender?: string | null
          id: string
          is_deleted?: boolean
          language?: string | null
          last_name?: string | null
          location?: string | null
          metadata?: Json | null
          middle_name?: string | null
          phone?: string | null
          preferred_name?: string | null
          primary_email?: string | null
          profile_completeness?: number
          profile_photo_url?: string | null
          search_vector?: unknown
          short_bio?: string | null
          slug: string
          social_links?: Json | null
          status?: string
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          visibility?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          alternate_email?: string | null
          alternate_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_deleted?: boolean
          language?: string | null
          last_name?: string | null
          location?: string | null
          metadata?: Json | null
          middle_name?: string | null
          phone?: string | null
          preferred_name?: string | null
          primary_email?: string | null
          profile_completeness?: number
          profile_photo_url?: string | null
          search_vector?: unknown
          short_bio?: string | null
          slug?: string
          social_links?: Json | null
          status?: string
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          visibility?: string
          website?: string | null
        }
        Relationships: []
      }
      program_members: {
        Row: {
          created_at: string
          created_by: string | null
          custom_title: string | null
          end_date: string | null
          id: string
          is_active: boolean
          profile_id: string
          program_id: string
          role: Database["public"]["Enums"]["program_role"]
          start_date: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          custom_title?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          profile_id: string
          program_id: string
          role?: Database["public"]["Enums"]["program_role"]
          start_date?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          custom_title?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          profile_id?: string
          program_id?: string
          role?: Database["public"]["Enums"]["program_role"]
          start_date?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_members_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_members_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_partners: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          contribution_details: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_id: string | null
          name: string
          partner_type: Database["public"]["Enums"]["partner_type"]
          program_id: string
          sort_order: number
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          contribution_details?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_id?: string | null
          name: string
          partner_type?: Database["public"]["Enums"]["partner_type"]
          program_id: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          contribution_details?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_id?: string | null
          name?: string
          partner_type?: Database["public"]["Enums"]["partner_type"]
          program_id?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_partners_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_partners_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_partners_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_volunteers: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string | null
          hours_contributed: number
          id: string
          program_id: string
          role: string
          start_date: string
          status: string
          updated_at: string
          updated_by: string | null
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          hours_contributed?: number
          id?: string
          program_id: string
          role?: string
          start_date?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          hours_contributed?: number
          id?: string
          program_id?: string
          role?: string
          start_date?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_volunteers_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "program_volunteers_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "program_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      programs: {
        Row: {
          banner_image_id: string | null
          cover_image_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          end_date: string | null
          full_description: string | null
          gallery_id: string | null
          id: string
          is_deleted: boolean
          is_featured: boolean
          location: string | null
          metadata: Json | null
          mission: string | null
          objectives: Json | null
          primary_taxonomy_id: string | null
          program_code: string
          program_type: Database["public"]["Enums"]["program_type"]
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          short_title: string | null
          slug: string
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["program_status"]
          title: string
          updated_at: string
          updated_by: string | null
          visibility: Database["public"]["Enums"]["program_visibility"]
        }
        Insert: {
          banner_image_id?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          end_date?: string | null
          full_description?: string | null
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          location?: string | null
          metadata?: Json | null
          mission?: string | null
          objectives?: Json | null
          primary_taxonomy_id?: string | null
          program_code: string
          program_type?: Database["public"]["Enums"]["program_type"]
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_title?: string | null
          slug: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Update: {
          banner_image_id?: string | null
          cover_image_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          end_date?: string | null
          full_description?: string | null
          gallery_id?: string | null
          id?: string
          is_deleted?: boolean
          is_featured?: boolean
          location?: string | null
          metadata?: Json | null
          mission?: string | null
          objectives?: Json | null
          primary_taxonomy_id?: string | null
          program_code?: string
          program_type?: Database["public"]["Enums"]["program_type"]
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_title?: string | null
          slug?: string
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: Database["public"]["Enums"]["program_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "programs_banner_image_id_fkey"
            columns: ["banner_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "media_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_primary_taxonomy_id_fkey"
            columns: ["primary_taxonomy_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_donations: {
        Row: {
          amount: number
          auto_renewal: boolean
          campaign_id: string | null
          cancellation_reason: string | null
          contact_id: string
          created_at: string
          currency: string
          end_date: string | null
          frequency: Database["public"]["Enums"]["recurring_frequency"]
          gateway_subscription_id: string | null
          id: string
          next_billing_date: string | null
          program_id: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          auto_renewal?: boolean
          campaign_id?: string | null
          cancellation_reason?: string | null
          contact_id: string
          created_at?: string
          currency?: string
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurring_frequency"]
          gateway_subscription_id?: string | null
          id?: string
          next_billing_date?: string | null
          program_id?: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          auto_renewal?: boolean
          campaign_id?: string | null
          cancellation_reason?: string | null
          contact_id?: string
          created_at?: string
          currency?: string
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurring_frequency"]
          gateway_subscription_id?: string | null
          id?: string
          next_billing_date?: string | null
          program_id?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recurring_donations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recurring_donations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "vw_donor_dashboard_stats"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "recurring_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "vw_campaign_progress"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "recurring_donations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "mvw_program_statistics"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "recurring_donations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      related_articles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          relationship_type: string | null
          sort_order: number
          source_article_id: string
          target_article_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          relationship_type?: string | null
          sort_order?: number
          source_article_id: string
          target_article_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          relationship_type?: string | null
          sort_order?: number
          source_article_id?: string
          target_article_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "related_articles_source_article_id_fkey"
            columns: ["source_article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_articles_target_article_id_fkey"
            columns: ["target_article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_snapshots: {
        Row: {
          checksum: string | null
          created_at: string
          export_format: Database["public"]["Enums"]["export_format"]
          generated_at: string | null
          generated_by: string | null
          id: string
          is_deleted: boolean
          media_file_id: string | null
          metadata: Json | null
          period_end: string | null
          period_start: string | null
          report_name: string
          report_type: Database["public"]["Enums"]["report_type"]
          status: Database["public"]["Enums"]["report_status"]
          storage_url: string | null
          updated_at: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          export_format?: Database["public"]["Enums"]["export_format"]
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_deleted?: boolean
          media_file_id?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          report_name: string
          report_type?: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_status"]
          storage_url?: string | null
          updated_at?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          export_format?: Database["public"]["Enums"]["export_format"]
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_deleted?: boolean
          media_file_id?: string | null
          metadata?: Json | null
          period_end?: string | null
          period_start?: string | null
          report_name?: string
          report_type?: Database["public"]["Enums"]["report_type"]
          status?: Database["public"]["Enums"]["report_status"]
          storage_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_snapshots_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_snapshots_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          is_deleted: boolean
          is_system_role: boolean
          priority: number
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          is_system_role?: boolean
          priority?: number
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          is_system_role?: boolean
          priority?: number
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: Database["public"]["Enums"]["setting_category"]
          created_at: string
          created_by: string | null
          data_type: Database["public"]["Enums"]["setting_data_type"]
          default_value: Json
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          display_name: string
          env_scope: Database["public"]["Enums"]["setting_env_scope"]
          id: string
          is_deleted: boolean
          is_editable: boolean
          is_encrypted: boolean
          key_name: string
          metadata: Json | null
          updated_at: string
          updated_by: string | null
          validation_rules: Json | null
          value: Json
          version: number
          visibility: Database["public"]["Enums"]["setting_visibility"]
        }
        Insert: {
          category?: Database["public"]["Enums"]["setting_category"]
          created_at?: string
          created_by?: string | null
          data_type?: Database["public"]["Enums"]["setting_data_type"]
          default_value: Json
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name: string
          env_scope?: Database["public"]["Enums"]["setting_env_scope"]
          id?: string
          is_deleted?: boolean
          is_editable?: boolean
          is_encrypted?: boolean
          key_name: string
          metadata?: Json | null
          updated_at?: string
          updated_by?: string | null
          validation_rules?: Json | null
          value: Json
          version?: number
          visibility?: Database["public"]["Enums"]["setting_visibility"]
        }
        Update: {
          category?: Database["public"]["Enums"]["setting_category"]
          created_at?: string
          created_by?: string | null
          data_type?: Database["public"]["Enums"]["setting_data_type"]
          default_value?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name?: string
          env_scope?: Database["public"]["Enums"]["setting_env_scope"]
          id?: string
          is_deleted?: boolean
          is_editable?: boolean
          is_encrypted?: boolean
          key_name?: string
          metadata?: Json | null
          updated_at?: string
          updated_by?: string | null
          validation_rules?: Json | null
          value?: Json
          version?: number
          visibility?: Database["public"]["Enums"]["setting_visibility"]
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_receipts: {
        Row: {
          checksum: string | null
          created_at: string
          created_by: string | null
          donation_id: string
          downloaded_count: number
          financial_year: string
          id: string
          issue_date: string
          pdf_file_id: string | null
          r2_url: string | null
          receipt_number: string
          updated_at: string
          version: number
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          donation_id: string
          downloaded_count?: number
          financial_year: string
          id?: string
          issue_date?: string
          pdf_file_id?: string | null
          r2_url?: string | null
          receipt_number: string
          updated_at?: string
          version?: number
        }
        Update: {
          checksum?: string | null
          created_at?: string
          created_by?: string | null
          donation_id?: string
          downloaded_count?: number
          financial_year?: string
          id?: string
          issue_date?: string
          pdf_file_id?: string | null
          r2_url?: string | null
          receipt_number?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: true
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_receipts_pdf_file_id_fkey"
            columns: ["pdf_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomies: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_deleted: boolean
          metadata: Json | null
          slug: string
          sort_order: number
          status: string
          type: string
          updated_at: string
          updated_by: string | null
          visibility: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_deleted?: boolean
          metadata?: Json | null
          slug: string
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_deleted?: boolean
          metadata?: Json | null
          slug?: string
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string
        }
        Relationships: []
      }
      taxonomy_terms: {
        Row: {
          code: string | null
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          metadata: Json | null
          parent_id: string | null
          search_vector: unknown
          slug: string
          sort_order: number
          taxonomy_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          search_vector?: unknown
          slug: string
          sort_order?: number
          taxonomy_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          search_vector?: unknown
          slug?: string
          sort_order?: number
          taxonomy_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_terms_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_terms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taxonomy_terms_taxonomy_id_fkey"
            columns: ["taxonomy_id"]
            isOneToOne: false
            referencedRelation: "taxonomies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          is_primary: boolean
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_availability: {
        Row: {
          available_weekdays: number[] | null
          available_weekends: number[] | null
          created_at: string
          id: string
          is_onsite: boolean
          is_remote: boolean
          preferred_shifts:
            | Database["public"]["Enums"]["availability_shift"][]
            | null
          updated_at: string
          valid_from: string
          valid_until: string | null
          volunteer_id: string
        }
        Insert: {
          available_weekdays?: number[] | null
          available_weekends?: number[] | null
          created_at?: string
          id?: string
          is_onsite?: boolean
          is_remote?: boolean
          preferred_shifts?:
            | Database["public"]["Enums"]["availability_shift"][]
            | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          volunteer_id: string
        }
        Update: {
          available_weekdays?: number[] | null
          available_weekends?: number[] | null
          created_at?: string
          id?: string
          is_onsite?: boolean
          is_remote?: boolean
          preferred_shifts?:
            | Database["public"]["Enums"]["availability_shift"][]
            | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_availability_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "volunteer_availability_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_availability_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      volunteer_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_type: Database["public"]["Enums"]["volunteer_document_type"]
          expiry_date: string | null
          id: string
          issue_date: string | null
          media_file_id: string
          updated_at: string
          updated_by: string | null
          verification_status: string
          verified_by: string | null
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_type: Database["public"]["Enums"]["volunteer_document_type"]
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          media_file_id: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          verified_by?: string | null
          volunteer_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_type?: Database["public"]["Enums"]["volunteer_document_type"]
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          media_file_id?: string
          updated_at?: string
          updated_by?: string | null
          verification_status?: string
          verified_by?: string | null
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_documents_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_documents_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "volunteer_documents_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_documents_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      volunteer_skill_map: {
        Row: {
          certification_details: string | null
          created_at: string
          created_by: string | null
          experience_level: Database["public"]["Enums"]["skill_level"]
          id: string
          is_verified: boolean
          skill_id: string
          updated_at: string
          updated_by: string | null
          volunteer_id: string
          years_of_experience: number | null
        }
        Insert: {
          certification_details?: string | null
          created_at?: string
          created_by?: string | null
          experience_level?: Database["public"]["Enums"]["skill_level"]
          id?: string
          is_verified?: boolean
          skill_id: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id: string
          years_of_experience?: number | null
        }
        Update: {
          certification_details?: string | null
          created_at?: string
          created_by?: string | null
          experience_level?: Database["public"]["Enums"]["skill_level"]
          id?: string
          is_verified?: boolean
          skill_id?: string
          updated_at?: string
          updated_by?: string | null
          volunteer_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_skill_map_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "volunteer_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_skill_map_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "volunteer_skill_map_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_skill_map_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      volunteer_skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          skill_name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          skill_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          skill_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_statistics: {
        Row: {
          average_rating: number | null
          certificates_earned: number
          events_participated: number
          last_activity_date: string | null
          leaderboard_score: number
          programs_participated: number
          total_hours: number
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          average_rating?: number | null
          certificates_earned?: number
          events_participated?: number
          last_activity_date?: string | null
          leaderboard_score?: number
          programs_participated?: number
          total_hours?: number
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          average_rating?: number | null
          certificates_earned?: number
          events_participated?: number
          last_activity_date?: string | null
          leaderboard_score?: number
          programs_participated?: number
          total_hours?: number
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_statistics_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: true
            referencedRelation: "mvw_active_volunteers"
            referencedColumns: ["volunteer_id"]
          },
          {
            foreignKeyName: "volunteer_statistics_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: true
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_statistics_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: true
            referencedRelation: "vw_volunteer_dashboard_stats"
            referencedColumns: ["volunteer_id"]
          },
        ]
      }
      volunteers: {
        Row: {
          background_verification_date: string | null
          biography: string | null
          blood_group: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          experience_years: number | null
          id: string
          is_deleted: boolean
          languages: string[] | null
          metadata: Json | null
          onboarding_date: string | null
          photo_id: string | null
          preferred_locations: string[] | null
          profile_id: string
          skills_summary: string | null
          status: Database["public"]["Enums"]["volunteer_status"]
          updated_at: string
          updated_by: string | null
          verification_status: Database["public"]["Enums"]["volunteer_verification_status"]
          volunteer_code: string
        }
        Insert: {
          background_verification_date?: string | null
          biography?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          experience_years?: number | null
          id?: string
          is_deleted?: boolean
          languages?: string[] | null
          metadata?: Json | null
          onboarding_date?: string | null
          photo_id?: string | null
          preferred_locations?: string[] | null
          profile_id: string
          skills_summary?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          updated_at?: string
          updated_by?: string | null
          verification_status?: Database["public"]["Enums"]["volunteer_verification_status"]
          volunteer_code: string
        }
        Update: {
          background_verification_date?: string | null
          biography?: string | null
          blood_group?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          experience_years?: number | null
          id?: string
          is_deleted?: boolean
          languages?: string[] | null
          metadata?: Json | null
          onboarding_date?: string | null
          photo_id?: string | null
          preferred_locations?: string[] | null
          profile_id?: string
          skills_summary?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"]
          updated_at?: string
          updated_by?: string | null
          verification_status?: Database["public"]["Enums"]["volunteer_verification_status"]
          volunteer_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mvw_active_volunteers: {
        Row: {
          event_count: number | null
          mapped_skills: number | null
          status: Database["public"]["Enums"]["volunteer_status"] | null
          total_hours: number | null
          volunteer_id: string | null
        }
        Relationships: []
      }
      mvw_crm_performance: {
        Row: {
          avg_resolution_hours: number | null
          category: Database["public"]["Enums"]["enquiry_category"] | null
          department: Database["public"]["Enums"]["enquiry_department"] | null
          escalated_tickets: number | null
          resolved_tickets: number | null
          total_tickets: number | null
        }
        Relationships: []
      }
      mvw_donation_summary: {
        Row: {
          currency: string | null
          donation_count: number | null
          donation_type: Database["public"]["Enums"]["donation_type"] | null
          month: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      mvw_event_participation: {
        Row: {
          attended_volunteers: number | null
          capacity_utilization: number | null
          event_id: string | null
          registration_limit: number | null
          registrations: number | null
          start_datetime: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          title: string | null
        }
        Relationships: []
      }
      mvw_program_statistics: {
        Row: {
          program_id: string | null
          status: Database["public"]["Enums"]["program_status"] | null
          title: string | null
          total_events: number | null
          total_funds_raised: number | null
          total_volunteers: number | null
        }
        Relationships: []
      }
      mvw_user_growth: {
        Row: {
          month: string | null
          new_users: number | null
        }
        Relationships: []
      }
      vw_admin_pending_tasks: {
        Row: {
          pending_count: number | null
          task_type: string | null
        }
        Relationships: []
      }
      vw_average_resolution_time: {
        Row: {
          avg_hours_to_resolve: number | null
          department: Database["public"]["Enums"]["enquiry_department"] | null
        }
        Relationships: []
      }
      vw_campaign_progress: {
        Row: {
          campaign_id: string | null
          end_date: string | null
          goal_amount: number | null
          percentage_completed: number | null
          raised_amount: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          title: string | null
        }
        Insert: {
          campaign_id?: string | null
          end_date?: string | null
          goal_amount?: number | null
          percentage_completed?: never
          raised_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title?: string | null
        }
        Update: {
          campaign_id?: string | null
          end_date?: string | null
          goal_amount?: number | null
          percentage_completed?: never
          raised_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          title?: string | null
        }
        Relationships: []
      }
      vw_category_distribution: {
        Row: {
          category: Database["public"]["Enums"]["enquiry_category"] | null
          ticket_count: number | null
        }
        Relationships: []
      }
      vw_daily_enquiries: {
        Row: {
          report_date: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      vw_department_workload: {
        Row: {
          active_tickets: number | null
          department: Database["public"]["Enums"]["enquiry_department"] | null
          high_priority: number | null
        }
        Relationships: []
      }
      vw_donor_dashboard_stats: {
        Row: {
          active_subscriptions: number | null
          contact_id: string | null
          last_donation_date: string | null
          lifetime_donated: number | null
          profile_id: string | null
          total_donations: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_monthly_trends: {
        Row: {
          month: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      vw_open_tickets: {
        Row: {
          created_at: string | null
          department: Database["public"]["Enums"]["enquiry_department"] | null
          enquiry_number: string | null
          escalation_level: number | null
          expected_resolution: string | null
          id: string | null
          priority: Database["public"]["Enums"]["enquiry_priority"] | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          department?: Database["public"]["Enums"]["enquiry_department"] | null
          enquiry_number?: string | null
          escalation_level?: number | null
          expected_resolution?: string | null
          id?: string | null
          priority?: Database["public"]["Enums"]["enquiry_priority"] | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          department?: Database["public"]["Enums"]["enquiry_department"] | null
          enquiry_number?: string | null
          escalation_level?: number | null
          expected_resolution?: string | null
          id?: string | null
          priority?: Database["public"]["Enums"]["enquiry_priority"] | null
          subject?: string | null
        }
        Relationships: []
      }
      vw_top_sources: {
        Row: {
          source: Database["public"]["Enums"]["enquiry_source"] | null
          ticket_count: number | null
        }
        Relationships: []
      }
      vw_volunteer_dashboard_stats: {
        Row: {
          attended_events: number | null
          event_count: number | null
          profile_id: string | null
          status: Database["public"]["Enums"]["volunteer_status"] | null
          total_hours: number | null
          upcoming_events: number | null
          volunteer_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      active_campaigns: {
        Args: { p_limit?: number }
        Returns: {
          campaign_id: string
          cover_image_id: string
          goal_amount: number
          raised_amount: number
          slug: string
          title: string
        }[]
      }
      admin_dashboard_overview: { Args: never; Returns: Json }
      album_media_count: { Args: { p_album_id: string }; Returns: number }
      album_size: { Args: { p_album_id: string }; Returns: number }
      album_statistics: { Args: { p_album_id: string }; Returns: Json }
      assign_taxonomy: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_is_primary?: boolean
          p_relationship_type?: string
          p_term_id: string
        }
        Returns: string
      }
      author_statistics: { Args: { p_author_id: string }; Returns: Json }
      available_volunteers_by_skill: {
        Args: { p_skill_name: string }
        Returns: {
          experience_level: Database["public"]["Enums"]["skill_level"]
          volunteer_id: string
          volunteer_name: string
        }[]
      }
      cancel_notification: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      current_user_email: { Args: never; Returns: string }
      current_user_id: { Args: never; Returns: string }
      current_user_permissions: { Args: never; Returns: string[] }
      current_user_profile_completeness: { Args: never; Returns: number }
      current_user_roles: { Args: never; Returns: string[] }
      dashboard_kpis: { Args: never; Returns: Json }
      department_queue: {
        Args: {
          p_dept: Database["public"]["Enums"]["enquiry_department"]
          p_limit?: number
        }
        Returns: {
          created_at: string | null
          department: Database["public"]["Enums"]["enquiry_department"] | null
          enquiry_number: string | null
          escalation_level: number | null
          expected_resolution: string | null
          id: string | null
          priority: Database["public"]["Enums"]["enquiry_priority"] | null
          subject: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "vw_open_tickets"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      donor_dashboard_overview: {
        Args: { p_profile_id: string }
        Returns: Json
      }
      escalate_ticket: { Args: { p_enquiry_id: string }; Returns: undefined }
      event_attendance_percentage: {
        Args: { p_event_id: string }
        Returns: number
      }
      event_capacity: { Args: { p_event_id: string }; Returns: Json }
      generate_album_slug: { Args: { p_title: string }; Returns: string }
      generate_article_slug: { Args: { p_title: string }; Returns: string }
      generate_contact_number: { Args: never; Returns: string }
      generate_event_slug: { Args: { p_title: string }; Returns: string }
      generate_org_number: { Args: never; Returns: string }
      generate_program_slug: { Args: { p_title: string }; Returns: string }
      generate_receipt_number: { Args: never; Returns: string }
      generate_snapshot: {
        Args: {
          p_report_name: string
          p_report_type: Database["public"]["Enums"]["report_type"]
          p_user_id: string
        }
        Returns: string
      }
      generate_ticket_number: { Args: never; Returns: string }
      get_featured_gallery: {
        Args: {
          p_collection: Database["public"]["Enums"]["featured_gallery_type"]
          p_limit?: number
        }
        Returns: {
          album_id: string
          cover_image_id: string
          media_count: number
          slug: string
          title: string
        }[]
      }
      get_notification_center: { Args: { p_user_id: string }; Returns: Json }
      get_public_settings: { Args: never; Returns: Json }
      get_related_articles: {
        Args: { p_article_id: string; p_limit?: number }
        Returns: {
          article_id: string
          cover_image_id: string
          match_reason: string
          published_at: string
          slug: string
          title: string
        }[]
      }
      get_setting: { Args: { p_key_name: string }; Returns: Json }
      get_taxonomy_tree: {
        Args: { p_taxonomy_id: string }
        Returns: {
          display_name: string
          id: string
          level: number
          parent_id: string
          path: string[]
          slug: string
        }[]
      }
      get_term_children: {
        Args: { p_term_id: string }
        Returns: {
          code: string | null
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          metadata: Json | null
          parent_id: string | null
          search_vector: unknown
          slug: string
          sort_order: number
          taxonomy_id: string
          updated_at: string
          updated_by: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "taxonomy_terms"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_term_path: {
        Args: { p_term_id: string }
        Returns: {
          display_name: string
          id: string
          level: number
          slug: string
        }[]
      }
      has_all_permissions: {
        Args: { required_permissions: string[] }
        Returns: boolean
      }
      has_any_role: { Args: { required_roles: string[] }; Returns: boolean }
      has_permission: {
        Args: { required_permission: string }
        Returns: boolean
      }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin_context: { Args: never; Returns: boolean }
      is_authenticated: { Args: never; Returns: boolean }
      is_crm_admin: { Args: never; Returns: boolean }
      is_registration_open: { Args: { p_event_id: string }; Returns: boolean }
      is_service_role: { Args: never; Returns: boolean }
      is_verified_volunteer: {
        Args: { p_volunteer_id: string }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_action: string
          p_category: Database["public"]["Enums"]["activity_category"]
          p_description: string
          p_entity_id?: string
          p_entity_type?: string
          p_metadata?: Json
          p_module: string
          p_new_values?: Json
          p_old_values?: Json
          p_severity?: Database["public"]["Enums"]["activity_severity"]
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_action: string
          p_description: string
          p_metadata?: Json
          p_severity?: Database["public"]["Enums"]["activity_severity"]
        }
        Returns: string
      }
      log_system_event: {
        Args: { p_action: string; p_description: string; p_metadata?: Json }
        Returns: string
      }
      mark_all_read: { Args: never; Returns: undefined }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      program_dashboard_details: {
        Args: { p_program_id: string }
        Returns: Json
      }
      program_exists: { Args: { p_slug: string }; Returns: boolean }
      program_statistics: { Args: { p_program_id: string }; Returns: Json }
      publish_article: { Args: { p_article_id: string }; Returns: undefined }
      queue_notification: {
        Args: {
          p_action_url?: string
          p_category?: Database["public"]["Enums"]["notification_category"]
          p_channel?: Database["public"]["Enums"]["notification_channel"]
          p_entity_id?: string
          p_entity_type?: string
          p_message: string
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_recipient_id: string
          p_sender_id?: string
          p_title: string
        }
        Returns: string
      }
      refresh_reports: { Args: never; Returns: undefined }
      refresh_volunteer_statistics: {
        Args: { p_volunteer_id: string }
        Returns: undefined
      }
      remove_taxonomy: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_relationship_type?: string
          p_term_id: string
        }
        Returns: undefined
      }
      reset_setting: { Args: { p_key_name: string }; Returns: undefined }
      resolve_ticket: {
        Args: { p_enquiry_id: string; p_resolved_by: string }
        Returns: undefined
      }
      set_setting: {
        Args: { p_key_name: string; p_value: Json }
        Returns: undefined
      }
      setting_exists: { Args: { p_key_name: string }; Returns: boolean }
      update_program_status: {
        Args: {
          p_new_status: Database["public"]["Enums"]["program_status"]
          p_program_id: string
        }
        Returns: undefined
      }
      volunteer_dashboard_overview: {
        Args: { p_profile_id: string }
        Returns: Json
      }
    }
    Enums: {
      activity_category:
        | "Authentication"
        | "Authorization"
        | "Users"
        | "Programs"
        | "Events"
        | "Gallery"
        | "News"
        | "Volunteers"
        | "Donations"
        | "Settings"
        | "Media"
        | "System"
      activity_severity: "info" | "success" | "warning" | "error" | "critical"
      album_status: "Draft" | "Published" | "Archived" | "Hidden"
      album_type:
        | "General"
        | "Program"
        | "Event"
        | "Volunteer"
        | "News"
        | "Campaign"
        | "Press"
        | "Annual Report"
        | "Featured"
        | "Video"
        | "Photo"
        | "Mixed"
      album_visibility: "Public" | "Members" | "Private" | "Internal"
      article_role:
        | "Primary Author"
        | "Co-author"
        | "Editor"
        | "Reviewer"
        | "Photographer"
        | "Contributor"
      article_status:
        | "Draft"
        | "In Review"
        | "Approved"
        | "Scheduled"
        | "Published"
        | "Archived"
        | "Rejected"
      article_type:
        | "News"
        | "Story"
        | "Success Story"
        | "Press Release"
        | "Announcement"
        | "Blog"
        | "Interview"
        | "Opinion"
        | "Campaign"
        | "Report"
        | "General"
      attendance_status: "present" | "absent" | "late" | "excused"
      availability_shift:
        | "Morning"
        | "Afternoon"
        | "Evening"
        | "Night"
        | "Flexible"
      campaign_status:
        | "Draft"
        | "Active"
        | "Paused"
        | "Completed"
        | "Cancelled"
        | "Archived"
      donation_type:
        | "One Time"
        | "Monthly"
        | "Quarterly"
        | "Half Yearly"
        | "Yearly"
        | "Campaign"
        | "Program"
        | "Emergency"
        | "CSR"
        | "Institutional"
        | "Memorial"
        | "Tribute"
      enquiry_category:
        | "Contact"
        | "Complaint"
        | "Feedback"
        | "Grievance"
        | "Donation"
        | "Volunteer"
        | "Media"
        | "Partnership"
        | "Career"
        | "CSR"
        | "Event"
        | "Program"
        | "Gallery"
        | "Technical"
        | "Other"
      enquiry_department:
        | "Administration"
        | "Programs"
        | "Volunteers"
        | "Finance"
        | "Media"
        | "CSR"
        | "Partnership"
        | "HR"
        | "IT"
        | "Legal"
        | "General"
      enquiry_priority: "Low" | "Normal" | "High" | "Urgent" | "Critical"
      enquiry_source:
        | "Website"
        | "Landing Page"
        | "Mobile App"
        | "Email"
        | "Phone"
        | "Walk-in"
        | "Social Media"
        | "Referral"
      enquiry_status:
        | "Open"
        | "Assigned"
        | "Pending"
        | "Waiting for User"
        | "Resolved"
        | "Closed"
        | "Rejected"
        | "Spam"
      event_mode: "Offline" | "Online" | "Hybrid"
      event_role:
        | "Organizer"
        | "Coordinator"
        | "Volunteer"
        | "Speaker"
        | "Trainer"
        | "Guest"
        | "Judge"
        | "Moderator"
        | "Support Staff"
      event_status:
        | "draft"
        | "upcoming"
        | "registration_open"
        | "registration_closed"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "archived"
      event_type:
        | "Workshop"
        | "Seminar"
        | "Training"
        | "Camp"
        | "Awareness"
        | "Competition"
        | "Volunteer"
        | "Meeting"
        | "Fundraiser"
        | "Celebration"
        | "Community"
        | "General"
      export_format: "CSV" | "Excel" | "PDF" | "JSON"
      featured_collection_type:
        | "Homepage"
        | "Programs"
        | "Events"
        | "Volunteers"
        | "Campaigns"
      featured_gallery_type:
        | "Homepage"
        | "Programs"
        | "Events"
        | "News"
        | "Volunteers"
        | "Campaigns"
      kpi_category:
        | "Finance"
        | "Programs"
        | "Events"
        | "Volunteers"
        | "CRM"
        | "Platform"
        | "Marketing"
      kpi_trend: "Up" | "Down" | "Flat"
      media_status:
        | "uploading"
        | "processing"
        | "ready"
        | "archived"
        | "deleted"
        | "failed"
      media_type:
        | "image"
        | "video"
        | "audio"
        | "pdf"
        | "document"
        | "spreadsheet"
        | "presentation"
        | "archive"
        | "other"
      media_visibility: "public" | "members" | "private" | "hidden"
      message_visibility: "Public" | "Internal"
      notification_category:
        | "marketing"
        | "announcements"
        | "system"
        | "transactional"
        | "social"
        | "alerts"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "approval"
        | "reminder"
      notification_channel: "in_app" | "email" | "push" | "sms" | "webhook"
      notification_priority: "low" | "normal" | "high" | "critical"
      notification_status:
        | "draft"
        | "queued"
        | "sending"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "cancelled"
        | "expired"
      partner_type:
        | "NGO"
        | "Government"
        | "Corporate"
        | "Educational Institution"
        | "Individual"
        | "Sponsor"
      payment_provider:
        | "Razorpay"
        | "Cashfree"
        | "Stripe"
        | "PayU"
        | "Offline"
        | "Bank Transfer"
        | "Cheque"
        | "UPI"
        | "Cash"
      payment_status:
        | "Pending"
        | "Authorized"
        | "Captured"
        | "Paid"
        | "Failed"
        | "Refund Pending"
        | "Refunded"
        | "Cancelled"
        | "Expired"
      program_role:
        | "Program Lead"
        | "Coordinator"
        | "Volunteer"
        | "Member"
        | "Advisor"
        | "Partner"
      program_status:
        | "draft"
        | "upcoming"
        | "active"
        | "paused"
        | "completed"
        | "archived"
        | "cancelled"
      program_type:
        | "Education"
        | "Healthcare"
        | "Environment"
        | "Community"
        | "Youth"
        | "Women"
        | "Research"
        | "Training"
        | "Campaign"
        | "Fundraising"
        | "Emergency"
        | "General"
      program_visibility: "public" | "private" | "members" | "internal"
      recurring_frequency: "Monthly" | "Quarterly" | "Half Yearly" | "Yearly"
      registration_role:
        | "Participant"
        | "Volunteer"
        | "Guest"
        | "Speaker"
        | "Staff"
      registration_status:
        | "pending"
        | "approved"
        | "waitlisted"
        | "rejected"
        | "cancelled"
      report_status: "Pending" | "Processing" | "Completed" | "Failed"
      report_type:
        | "Financial"
        | "Program"
        | "Event"
        | "Volunteer"
        | "CRM"
        | "System"
        | "Custom"
      setting_category:
        | "General"
        | "Branding"
        | "Contact"
        | "SEO"
        | "Social Media"
        | "Homepage"
        | "Programs"
        | "Events"
        | "Gallery"
        | "News"
        | "Volunteers"
        | "Donations"
        | "Email"
        | "Authentication"
        | "Media"
        | "Security"
        | "Analytics"
        | "Notifications"
        | "System"
      setting_data_type:
        | "string"
        | "boolean"
        | "integer"
        | "decimal"
        | "json"
        | "array"
        | "date"
        | "datetime"
        | "color"
        | "url"
        | "email"
        | "phone"
        | "file_reference"
        | "media_reference"
      setting_env_scope:
        | "global"
        | "production"
        | "staging"
        | "development"
        | "test"
      setting_visibility: "public" | "authenticated" | "admin_only" | "internal"
      skill_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
      volunteer_document_type:
        | "Identity Proof"
        | "Address Proof"
        | "Certificate"
        | "Medical Document"
        | "Consent Form"
        | "Police Verification"
        | "Other"
      volunteer_status:
        | "Applied"
        | "Pending Verification"
        | "Verified"
        | "Active"
        | "Inactive"
        | "Suspended"
        | "Archived"
      volunteer_verification_status:
        | "Unverified"
        | "Document Submitted"
        | "In Progress"
        | "Verified"
        | "Rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_category: [
        "Authentication",
        "Authorization",
        "Users",
        "Programs",
        "Events",
        "Gallery",
        "News",
        "Volunteers",
        "Donations",
        "Settings",
        "Media",
        "System",
      ],
      activity_severity: ["info", "success", "warning", "error", "critical"],
      album_status: ["Draft", "Published", "Archived", "Hidden"],
      album_type: [
        "General",
        "Program",
        "Event",
        "Volunteer",
        "News",
        "Campaign",
        "Press",
        "Annual Report",
        "Featured",
        "Video",
        "Photo",
        "Mixed",
      ],
      album_visibility: ["Public", "Members", "Private", "Internal"],
      article_role: [
        "Primary Author",
        "Co-author",
        "Editor",
        "Reviewer",
        "Photographer",
        "Contributor",
      ],
      article_status: [
        "Draft",
        "In Review",
        "Approved",
        "Scheduled",
        "Published",
        "Archived",
        "Rejected",
      ],
      article_type: [
        "News",
        "Story",
        "Success Story",
        "Press Release",
        "Announcement",
        "Blog",
        "Interview",
        "Opinion",
        "Campaign",
        "Report",
        "General",
      ],
      attendance_status: ["present", "absent", "late", "excused"],
      availability_shift: [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Flexible",
      ],
      campaign_status: [
        "Draft",
        "Active",
        "Paused",
        "Completed",
        "Cancelled",
        "Archived",
      ],
      donation_type: [
        "One Time",
        "Monthly",
        "Quarterly",
        "Half Yearly",
        "Yearly",
        "Campaign",
        "Program",
        "Emergency",
        "CSR",
        "Institutional",
        "Memorial",
        "Tribute",
      ],
      enquiry_category: [
        "Contact",
        "Complaint",
        "Feedback",
        "Grievance",
        "Donation",
        "Volunteer",
        "Media",
        "Partnership",
        "Career",
        "CSR",
        "Event",
        "Program",
        "Gallery",
        "Technical",
        "Other",
      ],
      enquiry_department: [
        "Administration",
        "Programs",
        "Volunteers",
        "Finance",
        "Media",
        "CSR",
        "Partnership",
        "HR",
        "IT",
        "Legal",
        "General",
      ],
      enquiry_priority: ["Low", "Normal", "High", "Urgent", "Critical"],
      enquiry_source: [
        "Website",
        "Landing Page",
        "Mobile App",
        "Email",
        "Phone",
        "Walk-in",
        "Social Media",
        "Referral",
      ],
      enquiry_status: [
        "Open",
        "Assigned",
        "Pending",
        "Waiting for User",
        "Resolved",
        "Closed",
        "Rejected",
        "Spam",
      ],
      event_mode: ["Offline", "Online", "Hybrid"],
      event_role: [
        "Organizer",
        "Coordinator",
        "Volunteer",
        "Speaker",
        "Trainer",
        "Guest",
        "Judge",
        "Moderator",
        "Support Staff",
      ],
      event_status: [
        "draft",
        "upcoming",
        "registration_open",
        "registration_closed",
        "ongoing",
        "completed",
        "cancelled",
        "archived",
      ],
      event_type: [
        "Workshop",
        "Seminar",
        "Training",
        "Camp",
        "Awareness",
        "Competition",
        "Volunteer",
        "Meeting",
        "Fundraiser",
        "Celebration",
        "Community",
        "General",
      ],
      export_format: ["CSV", "Excel", "PDF", "JSON"],
      featured_collection_type: [
        "Homepage",
        "Programs",
        "Events",
        "Volunteers",
        "Campaigns",
      ],
      featured_gallery_type: [
        "Homepage",
        "Programs",
        "Events",
        "News",
        "Volunteers",
        "Campaigns",
      ],
      kpi_category: [
        "Finance",
        "Programs",
        "Events",
        "Volunteers",
        "CRM",
        "Platform",
        "Marketing",
      ],
      kpi_trend: ["Up", "Down", "Flat"],
      media_status: [
        "uploading",
        "processing",
        "ready",
        "archived",
        "deleted",
        "failed",
      ],
      media_type: [
        "image",
        "video",
        "audio",
        "pdf",
        "document",
        "spreadsheet",
        "presentation",
        "archive",
        "other",
      ],
      media_visibility: ["public", "members", "private", "hidden"],
      message_visibility: ["Public", "Internal"],
      notification_category: [
        "marketing",
        "announcements",
        "system",
        "transactional",
        "social",
        "alerts",
        "info",
        "success",
        "warning",
        "error",
        "approval",
        "reminder",
      ],
      notification_channel: ["in_app", "email", "push", "sms", "webhook"],
      notification_priority: ["low", "normal", "high", "critical"],
      notification_status: [
        "draft",
        "queued",
        "sending",
        "sent",
        "delivered",
        "read",
        "failed",
        "cancelled",
        "expired",
      ],
      partner_type: [
        "NGO",
        "Government",
        "Corporate",
        "Educational Institution",
        "Individual",
        "Sponsor",
      ],
      payment_provider: [
        "Razorpay",
        "Cashfree",
        "Stripe",
        "PayU",
        "Offline",
        "Bank Transfer",
        "Cheque",
        "UPI",
        "Cash",
      ],
      payment_status: [
        "Pending",
        "Authorized",
        "Captured",
        "Paid",
        "Failed",
        "Refund Pending",
        "Refunded",
        "Cancelled",
        "Expired",
      ],
      program_role: [
        "Program Lead",
        "Coordinator",
        "Volunteer",
        "Member",
        "Advisor",
        "Partner",
      ],
      program_status: [
        "draft",
        "upcoming",
        "active",
        "paused",
        "completed",
        "archived",
        "cancelled",
      ],
      program_type: [
        "Education",
        "Healthcare",
        "Environment",
        "Community",
        "Youth",
        "Women",
        "Research",
        "Training",
        "Campaign",
        "Fundraising",
        "Emergency",
        "General",
      ],
      program_visibility: ["public", "private", "members", "internal"],
      recurring_frequency: ["Monthly", "Quarterly", "Half Yearly", "Yearly"],
      registration_role: [
        "Participant",
        "Volunteer",
        "Guest",
        "Speaker",
        "Staff",
      ],
      registration_status: [
        "pending",
        "approved",
        "waitlisted",
        "rejected",
        "cancelled",
      ],
      report_status: ["Pending", "Processing", "Completed", "Failed"],
      report_type: [
        "Financial",
        "Program",
        "Event",
        "Volunteer",
        "CRM",
        "System",
        "Custom",
      ],
      setting_category: [
        "General",
        "Branding",
        "Contact",
        "SEO",
        "Social Media",
        "Homepage",
        "Programs",
        "Events",
        "Gallery",
        "News",
        "Volunteers",
        "Donations",
        "Email",
        "Authentication",
        "Media",
        "Security",
        "Analytics",
        "Notifications",
        "System",
      ],
      setting_data_type: [
        "string",
        "boolean",
        "integer",
        "decimal",
        "json",
        "array",
        "date",
        "datetime",
        "color",
        "url",
        "email",
        "phone",
        "file_reference",
        "media_reference",
      ],
      setting_env_scope: [
        "global",
        "production",
        "staging",
        "development",
        "test",
      ],
      setting_visibility: ["public", "authenticated", "admin_only", "internal"],
      skill_level: ["Beginner", "Intermediate", "Advanced", "Expert"],
      volunteer_document_type: [
        "Identity Proof",
        "Address Proof",
        "Certificate",
        "Medical Document",
        "Consent Form",
        "Police Verification",
        "Other",
      ],
      volunteer_status: [
        "Applied",
        "Pending Verification",
        "Verified",
        "Active",
        "Inactive",
        "Suspended",
        "Archived",
      ],
      volunteer_verification_status: [
        "Unverified",
        "Document Submitted",
        "In Progress",
        "Verified",
        "Rejected",
      ],
    },
  },
} as const

