export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      exam_subjects: {
        Row: {
          exam_id: string
          id: string
          max_marks: number
          subject_id: string
        }
        Insert: {
          exam_id: string
          id?: string
          max_marks?: number
          subject_id: string
        }
        Update: {
          exam_id?: string
          id?: string
          max_marks?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_subjects_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year: string
          class: string
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          name: string
          section: string
          start_date: string
          status: Database["public"]["Enums"]["exam_status"]
          term: Database["public"]["Enums"]["term_type"]
          type: Database["public"]["Enums"]["exam_type"]
        }
        Insert: {
          academic_year: string
          class: string
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          name: string
          section: string
          start_date: string
          status?: Database["public"]["Enums"]["exam_status"]
          term: Database["public"]["Enums"]["term_type"]
          type: Database["public"]["Enums"]["exam_type"]
        }
        Update: {
          academic_year?: string
          class?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          name?: string
          section?: string
          start_date?: string
          status?: Database["public"]["Enums"]["exam_status"]
          term?: Database["public"]["Enums"]["term_type"]
          type?: Database["public"]["Enums"]["exam_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          entered_at: string
          exam_id: string
          gpa: number | null
          grade: string | null
          id: string
          marks_obtained: number
          max_marks: number
          remarks: string | null
          student_id: string
          subject_id: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          entered_at?: string
          exam_id: string
          gpa?: number | null
          grade?: string | null
          id?: string
          marks_obtained: number
          max_marks?: number
          remarks?: string | null
          student_id: string
          subject_id: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          entered_at?: string
          exam_id?: string
          gpa?: number | null
          grade?: string | null
          id?: string
          marks_obtained?: number
          max_marks?: number
          remarks?: string | null
          student_id?: string
          subject_id?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          class: string
          created_at: string
          email: string | null
          guardian: string | null
          guardian_contact: string | null
          id: string
          name: string
          registration_date: string | null
          roll_number: string | null
          section: string
          updated_at: string
        }
        Insert: {
          class: string
          created_at?: string
          email?: string | null
          guardian?: string | null
          guardian_contact?: string | null
          id?: string
          name: string
          registration_date?: string | null
          roll_number?: string | null
          section: string
          updated_at?: string
        }
        Update: {
          class?: string
          created_at?: string
          email?: string | null
          guardian?: string | null
          guardian_contact?: string | null
          id?: string
          name?: string
          registration_date?: string | null
          roll_number?: string | null
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          max_marks: number
          name: string
          passing_marks: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          max_marks?: number
          name: string
          passing_marks?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          max_marks?: number
          name?: string
          passing_marks?: number
        }
        Relationships: []
      }
      teacher_auth: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          teacher_id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          teacher_id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          teacher_id?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_auth_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          classes: string[]
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          classes?: string[]
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          classes?: string[]
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          join_date: string
          name: string
          role: Database["public"]["Enums"]["teacher_role"]
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id?: string
          join_date?: string
          name: string
          role?: Database["public"]["Enums"]["teacher_role"]
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          join_date?: string
          name?: string
          role?: Database["public"]["Enums"]["teacher_role"]
        }
        Relationships: []
      }
      template_data: {
        Row: {
          created_at: string
          description: string | null
          filename: string
          id: string
          is_active: boolean
          sample_data: Json
          template_code: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          filename: string
          id?: string
          is_active?: boolean
          sample_data: Json
          template_code: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          filename?: string
          id?: string
          is_active?: boolean
          sample_data?: Json
          template_code?: string
          type?: string
          updated_at?: string
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
      exam_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      exam_type: "midterm" | "final" | "unit-test" | "assignment" | "practical"
      teacher_role: "teacher" | "head-teacher" | "admin"
      term_type: "first" | "second" | "third"
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
    Enums: {
      exam_status: ["upcoming", "ongoing", "completed", "cancelled"],
      exam_type: ["midterm", "final", "unit-test", "assignment", "practical"],
      teacher_role: ["teacher", "head-teacher", "admin"],
      term_type: ["first", "second", "third"],
    },
  },
} as const
