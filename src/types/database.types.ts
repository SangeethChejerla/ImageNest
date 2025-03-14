export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          created_at: string
          user_id: string
          path: string
          name: string
          size: number
          type: string
          description: string | null
          ai_description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          path: string
          name: string
          size: number
          type: string
          description?: string | null
          ai_description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          path?: string
          name?: string
          size?: number
          type?: string
          description?: string | null
          ai_description?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
}

