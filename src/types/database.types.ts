export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_id: string | null
          child_id: string | null
          created_at: string
          family_id: string
          id: string
          metadata: Json
          point_value: number | null
          title: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          child_id?: string | null
          created_at?: string
          family_id: string
          id?: string
          metadata?: Json
          point_value?: number | null
          title?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          child_id?: string | null
          created_at?: string
          family_id?: string
          id?: string
          metadata?: Json
          point_value?: number | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          avatar_gradient: number | null
          avatar_icon: string | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          family_id: string
          id: string
          is_under_13: boolean
          last_streak_date: string | null
          name: string
          parental_consent_at: string | null
          parental_consent_given: boolean
          points: number
          streak_days: number
        }
        Insert: {
          avatar_gradient?: number | null
          avatar_icon?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          family_id: string
          id?: string
          is_under_13?: boolean
          last_streak_date?: string | null
          name: string
          parental_consent_at?: string | null
          parental_consent_given?: boolean
          points?: number
          streak_days?: number
        }
        Update: {
          avatar_gradient?: number | null
          avatar_icon?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          family_id?: string
          id?: string
          is_under_13?: boolean
          last_streak_date?: string | null
          name?: string
          parental_consent_at?: string | null
          parental_consent_given?: boolean
          points?: number
          streak_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "children_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      chore_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          child_id: string
          chore_id: string
          completed_at: string | null
          due_date: string | null
          id: string
          note: string | null
          status: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          child_id: string
          chore_id: string
          completed_at?: string | null
          due_date?: string | null
          id?: string
          note?: string | null
          status?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          child_id?: string
          chore_id?: string
          completed_at?: string | null
          due_date?: string | null
          id?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "chore_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chore_assignments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chore_assignments_chore_id_fkey"
            columns: ["chore_id"]
            isOneToOne: false
            referencedRelation: "chores"
            referencedColumns: ["id"]
          },
        ]
      }
      chores: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          family_id: string
          frequency: string
          id: string
          is_active: boolean
          point_value: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          family_id: string
          frequency?: string
          id?: string
          is_active?: boolean
          point_value: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          family_id?: string
          frequency?: string
          id?: string
          is_active?: boolean
          point_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chores_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chores_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          family_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          child_id: string
          created_at: string
          created_by: string | null
          family_id: string
          id: string
          is_active: boolean
          kind: string
          reached_at: string | null
          reward_id: string | null
          target_points: number
          title: string
        }
        Insert: {
          child_id: string
          created_at?: string
          created_by?: string | null
          family_id: string
          id?: string
          is_active?: boolean
          kind: string
          reached_at?: string | null
          reward_id?: string | null
          target_points: number
          title: string
        }
        Update: {
          child_id?: string
          created_at?: string
          created_by?: string | null
          family_id?: string
          id?: string
          is_active?: boolean
          kind?: string
          reached_at?: string | null
          reward_id?: string | null
          target_points?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          id: string
          note: string | null
          reference_id: string | null
          reference_type: string | null
          type: string
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          id?: string
          note?: string | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_gradient: number | null
          avatar_icon: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_gradient?: number | null
          avatar_icon?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_gradient?: number | null
          avatar_icon?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          child_id: string
          fulfilled_at: string | null
          fulfilled_by: string | null
          id: string
          points_spent: number
          redeemed_at: string
          reward_id: string
        }
        Insert: {
          child_id: string
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          points_spent: number
          redeemed_at?: string
          reward_id: string
        }
        Update: {
          child_id?: string
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          points_spent?: number
          redeemed_at?: string
          reward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_fulfilled_by_fkey"
            columns: ["fulfilled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          family_id: string
          icon_name: string | null
          id: string
          is_active: boolean
          point_cost: number
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          family_id: string
          icon_name?: string | null
          id?: string
          is_active?: boolean
          point_cost: number
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          family_id?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean
          point_cost?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          dark_mode: boolean
          notification_chore_complete: boolean
          notification_daily_summary: boolean
          notification_reward_redeemed: boolean
          notifications_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          dark_mode?: boolean
          notification_chore_complete?: boolean
          notification_daily_summary?: boolean
          notification_reward_redeemed?: boolean
          notifications_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          dark_mode?: boolean
          notification_chore_complete?: boolean
          notification_daily_summary?: boolean
          notification_reward_redeemed?: boolean
          notifications_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_chore: {
        Args: { p_assignment_id: string }
        Returns: {
          assigned_at: string
          assigned_by: string | null
          child_id: string
          chore_id: string
          completed_at: string | null
          due_date: string | null
          id: string
          note: string | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "chore_assignments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_onboarding: {
        Args: {
          p_child_dob?: string
          p_child_name: string
          p_family_name: string
        }
        Returns: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        SetofOptions: {
          from: "*"
          to: "families"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_user_account: { Args: never; Returns: undefined }
      generate_invite_code: { Args: never; Returns: string }
      is_family_member: { Args: { p_family_id: string }; Returns: boolean }
      join_family_by_code: {
        Args: { p_code: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        SetofOptions: {
          from: "*"
          to: "families"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      redeem_reward: {
        Args: { p_child_id: string; p_reward_id: string }
        Returns: {
          child_id: string
          fulfilled_at: string | null
          fulfilled_by: string | null
          id: string
          points_spent: number
          redeemed_at: string
          reward_id: string
        }
        SetofOptions: {
          from: "*"
          to: "reward_redemptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reject_chore: {
        Args: { p_assignment_id: string; p_note?: string }
        Returns: {
          assigned_at: string
          assigned_by: string | null
          child_id: string
          chore_id: string
          completed_at: string | null
          due_date: string | null
          id: string
          note: string | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "chore_assignments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_chore: {
        Args: { p_assignment_id: string }
        Returns: {
          assigned_at: string
          assigned_by: string | null
          child_id: string
          chore_id: string
          completed_at: string | null
          due_date: string | null
          id: string
          note: string | null
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "chore_assignments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_streak: {
        Args: { p_actor_id: string; p_child_id: string; p_family_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
