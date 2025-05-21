export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      evolution_records: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          professional_id: string | null
          record_date: string | null
          resident_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          record_date?: string | null
          resident_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          record_date?: string | null
          resident_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evolution_records_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolution_records_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_schedules: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          professional_id: string | null
          start_time: string | null
          weekday: number | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          professional_id?: string | null
          start_time?: string | null
          weekday?: number | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          professional_id?: string | null
          start_time?: string | null
          weekday?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_schedules_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          created_at: string | null
          document_number: string | null
          document_type: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          profession_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          profession_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          profession_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "professions"
            referencedColumns: ["id"]
          },
        ]
      }
      professions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      resident_addresses: {
        Row: {
          city: string | null
          complement: string | null
          created_at: string | null
          id: string
          neighborhood: string | null
          number: string | null
          resident_id: string | null
          state: string | null
          street: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          created_at?: string | null
          id?: string
          neighborhood?: string | null
          number?: string | null
          resident_id?: string | null
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          created_at?: string | null
          id?: string
          neighborhood?: string | null
          number?: string | null
          resident_id?: string | null
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resident_addresses_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      resident_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_emergency: boolean | null
          name: string
          phone: string | null
          relationship: string | null
          resident_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_emergency?: boolean | null
          name: string
          phone?: string | null
          relationship?: string | null
          resident_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_emergency?: boolean | null
          name?: string
          phone?: string | null
          relationship?: string | null
          resident_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resident_contacts_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      residents: {
        Row: {
          admission_date: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          gender: string | null
          id: string
          marital_status: string | null
          name: string
          notes: string | null
          rg: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admission_date?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          name: string
          notes?: string | null
          rg?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_date?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          name?: string
          notes?: string | null
          rg?: string | null
          status?: string | null
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
